const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Carregar sprite do jogador
const playerImage = new Image();
playerImage.src="player.png";

// Jogador
const player = {
  x: 100,
  y: 100,
  width: 32,
  height: 32,
  speed: 3
};

// Teclado
const keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// Atualiza posição do jogador
function update() {
  if (keys["w"] || keys["ArrowUp"]) player.y -= player.speed;
  if (keys["s"] || keys["ArrowDown"]) player.y += player.speed;
  if (keys["a"] || keys["ArrowLeft"]) player.x -= player.speed;
  if (keys["d"] || keys["ArrowRight"]) player.x += player.speed;
}

// Desenha o jogador e fundo
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#444";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Desenha a imagem do jogador
  ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
}

// Loop do jogo
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
