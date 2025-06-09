const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.getElementById("startScreen").style.display = "flex";

const TILE = 32;
const tileImages = {
  0: new Image(), // chão
  1: new Image(), // parede
  2: new Image(), // porta
};

tileImages[0].src = "assets/tiles/floor.png";
tileImages[1].src = "assets/tiles/wall.png";
tileImages[2].src = "assets/tiles/door.png";

let rooms = [];
let roomMap = {};
let currentRoom = null;
let player = { x: 100, y: 100, size: 30 };

const keys = {};
window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);

let loadedImages = 0;
const totalImages = Object.keys(tileImages).length;

for (const key in tileImages) {
  tileImages[key].onload = () => {
    loadedImages++;
    if (loadedImages === totalImages) {
      generateMap();
      gameLoop();
    }
  };
}

function createRoom(x, y) {
  return {
    id: rooms.length,
    x, y,
    connections: { top: null, bottom: null, left: null, right: null },
    cleared: false,
    isBoss: false,
    mobs: [],
    type: null
  };
}

function generateMap() {
  const start = createRoom(0, 0);
  start.isStart = true; // <== Marca como a sala do tutorial

  rooms.push(start);
  roomMap["0,0"] = start;

  let current = start;
  let visited = new Set(["0,0"]);

  for (let i = 1; i < 5; i++) {
    const [dx, dy, dirFrom, dirTo] = randomDirection(current.x, current.y, visited);
    if (dx == null) break;

    const newRoom = createRoom(current.x + dx, current.y + dy);
    current.connections[dirFrom] = newRoom;
    newRoom.connections[dirTo] = current;

    rooms.push(newRoom);
    roomMap[`${newRoom.x},${newRoom.y}`] = newRoom;
    current = newRoom;
    visited.add(`${newRoom.x},${newRoom.y}`);
  }

  if (rooms.length > 1) rooms[rooms.length - 1].isBoss = true;

  currentRoom = start;


  // Definir tipos e adicionar mobs
  rooms.forEach((room, index) => {
    if (room.isStart) {
      room.type = "tutorial";
      // sem mobs
    } else if (index === rooms.length - 1) {
      room.type = "boss";
      room.mobs.push(new Mob(canvas.width / 2 - 40, canvas.height / 2 - 40, "yellow"));
    } else {
      room.type = "mob";
      room.mobs.push(new Mob(200, 200, "red"), new Mob(400, 300, "red"));
    }
  });


}


function randomDirection(x, y, visited) {
  const dirs = [
    [0, -1, "top", "bottom"],
    [0, 1, "bottom", "top"],
    [-1, 0, "left", "right"],
    [1, 0, "right", "left"]
  ].sort(() => Math.random() - 0.5);

  for (const [dx, dy, from, to] of dirs) {
    const key = `${x + dx},${y + dy}`;
    if (!visited.has(key)) {
      return [dx, dy, from, to];
    }
  }
  return [null, null, null, null];
}

function update() {
  if (keys["w"]) player.y -= 3;
  if (keys["s"]) player.y += 3;
  if (keys["a"]) player.x -= 3;
  if (keys["d"]) player.x += 3;

  currentRoom.mobs.forEach(mob => mob.update());

  const margin = 10;
  if (player.y < margin && currentRoom.connections.top) {
    changeRoom(currentRoom.connections.top, "top");
  } else if (player.y + player.size > canvas.height - margin && currentRoom.connections.bottom) {
    changeRoom(currentRoom.connections.bottom, "bottom");
  } else if (player.x < margin && currentRoom.connections.left) {
    changeRoom(currentRoom.connections.left, "left");
  } else if (player.x + player.size > canvas.width - margin && currentRoom.connections.right) {
    changeRoom(currentRoom.connections.right, "right");
  }
}

function changeRoom(nextRoom, direction) {
  currentRoom = nextRoom;
  if (direction === "top") player.y = canvas.height - player.size - 15;
  if (direction === "bottom") player.y = 15;
  if (direction === "left") player.x = canvas.width - player.size - 15;
  if (direction === "right") player.x = 15;
}

function drawRoom() {
  drawTileMap();
  currentRoom.mobs.forEach(mob => mob.draw());
  ctx.fillStyle = "#0af";
  ctx.fillRect(player.x, player.y, player.size, player.size);

  console.log("Mobs nesta sala:", currentRoom.mobs.length);
}

function gameLoop() {
  update();
  drawRoom();
  requestAnimationFrame(gameLoop);
}

function drawTileMap() {
  const cols = Math.ceil(canvas.width / TILE);
  const rows = Math.ceil(canvas.height / TILE);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let tileId = 0;
      if (y === 0 || y === rows - 1 || x === 0 || x === cols - 1) tileId = 1;

      const midX = Math.floor(cols / 2);
      const midY = Math.floor(rows / 2);
      if (currentRoom.connections.top && y === 0 && x === midX) tileId = 2;
      if (currentRoom.connections.bottom && y === rows - 1 && x === midX) tileId = 2;
      if (currentRoom.connections.left && x === 0 && y === midY) tileId = 2;
      if (currentRoom.connections.right && x === cols - 1 && y === midY) tileId = 2;

      const img = tileImages[tileId];
      ctx.drawImage(img, x * TILE, y * TILE, TILE, TILE);
    }
  }
}

class Mob {
  constructor(x, y, color = "red") {
    this.x = x;
    this.y = y;
    this.size = 28;
    this.color = color;
    this.speed = 1;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }

  update() {
    // Movimento futuro
  }
}


function startGame() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("gameCanvas").style.display = "block";

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  if (loadedImages === totalImages) {
    generateMap();
    gameLoop();
  } else {
    const waitImages = setInterval(() => {
      if (loadedImages === totalImages) {
        clearInterval(waitImages);
        generateMap();
        gameLoop();
      }
    }, 100);
  }
}
