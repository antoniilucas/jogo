export class PlayerNetwork {
  constructor(playerData) {
    this.id = playerData.id;
    this.x = playerData.x;
    this.y = playerData.y;
    this.width = 32;
    this.height = 32;
    this.level = playerData.level || 1;
    this.name = playerData.name || `Player_${this.id.substring(0, 4)}`;
    this.lastUpdate = Date.now();
  }

  updateFromNetwork(playerData) {
    this.x = playerData.x;
    this.y = playerData.y;
    this.level = playerData.level || this.level;
    this.lastUpdate = Date.now();
  }

  isActive() {
    // Considera o jogador inativo se não houver atualizações nos últimos 10 segundos
    return Date.now() - this.lastUpdate < 10000;
  }
}