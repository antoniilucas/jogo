import { Player } from "./entities/Player.js";
import { LevelManager } from "./levels/LevelManager.js";
import { MultiplayerManager } from "./multiplayer/MultiplayerManager.js";
import { CollisionDetector } from "./utils/CollisionDetector.js";
import { authManager } from "../auth/auth.js";

export class Game {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.isRunning = false;
    this.currentPlayer = null;
    this.levelManager = new LevelManager();
    this.multiplayerManager = null;
    this.collisionDetector = new CollisionDetector();
    this.currentLevelData = null;
  }

  async init() {
    // Autenticação
    try {
      await authManager.signInWithGoogle();
      this.currentPlayer = new Player(authManager.getCurrentUser().uid, 100, 100, true);
      
      // Inicializa multiplayer
      this.multiplayerManager = new MultiplayerManager('game-room-1', this.currentPlayer);
      this.multiplayerManager.connect();
      
      // Carrega o primeiro nível
      this.currentLevelData = this.levelManager.loadLevel(1);
      
      // Inicia o loop do jogo
      this.isRunning = true;
      this.gameLoop();
    } catch (error) {
      console.error("Game initialization failed:", error);
    }
  }

  gameLoop() {
    if (!this.isRunning) return;
    
    // Limpa o canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Atualiza e renderiza o jogo
    this.update();
    this.render();
    
    // Continua o loop
    requestAnimationFrame(() => this.gameLoop());
  }

  update() {
    // Atualiza o jogador
    // (você implementaria os controles aqui)
    
    // Verifica colisões com itens
    this.checkItemCollisions();
    
    // Atualiza dados multiplayer
    if (this.multiplayerManager) {
      this.multiplayerManager.updatePlayerData();
    }
  }

  checkItemCollisions() {
    if (!this.currentLevelData || !this.currentLevelData.items) return;
    
    this.currentLevelData.items.forEach(item => {
      if (!item.collected && this.collisionDetector.checkCollision(this.currentPlayer, item)) {
        if (this.currentPlayer.collectItem(item)) {
          item.collected = true;
          this.audioManager.playCollectSound(item.type);
        }
      }
    });
  }

  render() {
    // Renderiza o nível
    // (implemente a renderização do mapa, itens, inimigos, etc.)
    
    // Renderiza o jogador
    this.renderPlayer(this.currentPlayer);
    
    // Renderiza outros jogadores (multiplayer)
    if (this.multiplayerManager) {
      Object.values(this.multiplayerManager.players).forEach(player => {
        this.renderPlayer(player);
      });
    }
    
    // Renderiza UI (inventário, nível, etc.)
    this.renderUI();
  }

  renderPlayer(player) {
    // Implemente a renderização do jogador
    this.ctx.fillStyle = player.isCurrentPlayer ? 'blue' : 'red';
    this.ctx.fillRect(player.x, player.y, player.width, player.height);
  }

  renderUI() {
    // Implemente a renderização da UI
    this.ctx.fillStyle = 'white';
    this.ctx.font = '20px Arial';
    this.ctx.fillText(`Level: ${this.levelManager.currentLevel}`, 20, 30);
    this.ctx.fillText(`XP: ${this.currentPlayer.experience}`, 20, 60);
  }
}