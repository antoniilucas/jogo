import { Game } from "./game/game.js";
import { authManager } from "./auth/auth.js";

// Inicializa o jogo quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', async () => {
  const game = new Game('gameCanvas');
  
  try {
    await game.init();
  } catch (error) {
    console.error("Error initializing game:", error);
    alert("Failed to initialize the game. Please try again.");
  }
});

// Configura botão de login manual se necessário
document.getElementById('loginButton')?.addEventListener('click', async () => {
  try {
    await authManager.signInWithGoogle();
    location.reload(); // Recarrega a página após login
  } catch (error) {
    console.error("Login failed:", error);
  }
});