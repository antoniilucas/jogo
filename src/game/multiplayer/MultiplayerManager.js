import { database } from "../../config/firebase-config.js";
import { ref, onValue, set, update, off } from "firebase/database";

export class MultiplayerManager {
  constructor(gameId, currentPlayer) {
    this.gameId = gameId;
    this.currentPlayer = currentPlayer;
    this.players = {};
    this.gameRef = ref(database, `games/${this.gameId}`);
  }

  connect() {
    // Envia dados do jogador atual para o Firebase
    this.updatePlayerData();
    
    // Escuta por mudanças nos dados do jogo
    onValue(this.gameRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.players) {
        this.players = data.players;
        // Remove o jogador atual da lista de outros jogadores
        delete this.players[this.currentPlayer.id];
      }
    });
  }

  updatePlayerData() {
    const playerRef = ref(database, `games/${this.gameId}/players/${this.currentPlayer.id}`);
    set(playerRef, {
      x: this.currentPlayer.x,
      y: this.currentPlayer.y,
      level: this.currentPlayer.level,
      // Outros dados relevantes para sincronização
    });
  }

  disconnect() {
    const playerRef = ref(database, `games/${this.gameId}/players/${this.currentPlayer.id}`);
    set(playerRef, null);
    off(this.gameRef);
  }
}