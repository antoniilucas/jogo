import { CollectableItem } from "./CollectableItem.js";
import { randomInt } from "../utils/helpers.js";

export class Boss {
  constructor(level) {
    this.level = level;
    this.health = 100 * level;
    this.maxHealth = this.health;
    this.damage = 20 * level;
    this.width = 64;
    this.height = 64;
    this.x = 0;
    this.y = 0;
    this.speed = 2 + (level / 5);
    this.attackCooldown = 0;
    this.reward = this.generateReward();
  }

  generateReward() {
    const rewards = [];
    
    // Moedas
    rewards.push(new CollectableItem(
      CollectableItem.ITEM_TYPES.COIN,
      0, 0,
      { quantity: randomInt(10 * this.level, 20 * this.level) }
    ));
    
    // Chave especial
    rewards.push(new CollectableItem(
      CollectableItem.ITEM_TYPES.KEY,
      0, 0,
      { 
        name: `Chave do Boss Nível ${this.level}`,
        description: `Chave especial derrotando o Boss do nível ${this.level}`
      }
    ));
    
    // Espada poderosa
    if (this.level % 5 === 0) {
      rewards.push(new CollectableItem(
        CollectableItem.ITEM_TYPES.SWORD,
        0, 0,
        { 
          level: Math.min(this.level / 5 + 1, 5),
          name: `Espada do Boss Nível ${this.level}`,
          description: `Espada lendária do Boss nível ${this.level}`
        }
      ));
    }
    
    return rewards;
  }

  update(target) {
    // Movimento simples em direção ao alvo
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0) {
      this.x += (dx / distance) * this.speed;
      this.y += (dy / distance) * this.speed;
    }

    // Atualiza cooldown do ataque
    if (this.attackCooldown > 0) {
      this.attackCooldown--;
    }
  }

  attack(target) {
    if (this.attackCooldown === 0) {
      this.attackCooldown = 60; // 1 segundo em 60 FPS
      return this.damage;
    }
    return 0;
  }

  takeDamage(amount) {
    this.health -= amount;
    return this.health <= 0;
  }
}