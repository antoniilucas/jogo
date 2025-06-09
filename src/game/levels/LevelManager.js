import { AudioManager } from "../utils/AudioManager.js";

export class LevelManager {
  constructor() {
    this.currentLevel = 1;
    this.maxLevel = 15;
    this.bossLevels = [5, 10, 15];
    this.audioManager = new AudioManager();
  }

  loadLevel(levelNumber) {
    if (levelNumber < 1 || levelNumber > this.maxLevel) return false;
    
    this.currentLevel = levelNumber;
    
    if (this.isBossLevel()) {
      this.audioManager.playBossMusic();
    } else {
      this.audioManager.playLevelMusic();
    }
    
    // Carrega os dados do nível (de um arquivo levelX.js)
    return this.getLevelData(levelNumber);
  }

  isBossLevel() {
    return this.bossLevels.includes(this.currentLevel);
  }

  getLevelData(levelNumber) {
    // Aqui você carregaria os dados específicos do nível
    // Isso pode ser hardcoded ou carregado de um arquivo JSON
    return {
      map: [],
      items: this.generateLevelItems(levelNumber),
      enemies: [],
      boss: this.isBossLevel() ? this.generateBoss(levelNumber) : null
    };
  }

  generateLevelItems(levelNumber) {
    const items = [];
    // Gera chaves
    for (let i = 0; i < 3; i++) {
      items.push(new CollectableItem(
        CollectableItem.ITEM_TYPES.KEY,
        Math.random() * 800,
        Math.random() * 600
      ));
    }
    
    // Gera moedas
    for (let i = 0; i < 10; i++) {
      items.push(new CollectableItem(
        CollectableItem.ITEM_TYPES.COIN,
        Math.random() * 800,
        Math.random() * 600,
        { quantity: Math.floor(Math.random() * 5) + 1 }
      ));
    }
    
    // Gera espadas em níveis específicos
    if (levelNumber % 3 === 0) {
      const swordLevel = Math.min(Math.floor(levelNumber / 3) + 1, 5);
      items.push(new CollectableItem(
        CollectableItem.ITEM_TYPES.SWORD,
        Math.random() * 800,
        Math.random() * 600,
        { level: swordLevel }
      ));
    }
    
    return items;
  }

  generateBoss(levelNumber) {
    const bossLevel = Math.floor(levelNumber / 5) * 5;
    return new Boss(bossLevel);
  }
}