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
let collisionMap = [];

tileImages[0].src = "assets/tiles/floor.png";
tileImages[1].src = "assets/tiles/wall.png";
tileImages[2].src = "assets/tiles/door.png";

let rooms = [];
let roomMap = {};
let currentRoom = null;
let player = {
  x: 100,
  y: 100,
  size: 30,
  hp: 100,
  maxHp: 100,
  invincible: false, // para evitar hit contínuo
  weapon: {
    name: "Espada de Ferro",
    damage: 20,
    reach: 40
  }
};
let droppedItems = [];



class Item {
  constructor(id, name, description, attributes, stackable = false) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.attributes = attributes;
    this.stackable = stackable;
    this.quantity = 1;
  }
}

class Inventory {
  constructor(size) {
    this.size = size;
    this.items = [];
  }

  addItem(newItem) {
    if (newItem.stackable) {
      const existing = this.items.find(i => i.id === newItem.id);
      if (existing) {
        existing.quantity += newItem.quantity;
        return true;
      }
    }
    if (this.items.length < this.size) {
      this.items.push(newItem);
      return true;
    }
    return false;
  }
}

const inventory = new Inventory(10);

// Itens exemplo

const potion = new Item(
  "potion",
  "Poção de Vida",
  "Restaura 15 de vida",
  { heal: 15 },
  true
);

// Adicione no inventário para teste
inventory.addItem(new Item("potion", "Poção de Vida", "Restaura 15 de vida", { heal: 15 }, true));
inventory.addItem(new Item("potion", "Poção de Vida", "Restaura 15 de vida", { heal: 15 }, true));

let inventoryOpen = false;


const keys = {};
window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);
window.addEventListener("mousedown", e => {
  if (e.button === 0) { // botão esquerdo do mouse (M1)
    attack();
  }
});
window.addEventListener("keydown", e => {
  if (e.key.toLowerCase() === "i") {
    inventoryOpen = !inventoryOpen;
  }
});
let mouse = { x: 0, y: 0 };

canvas.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});



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



function isColliding(a, b) {
  return (
    a.x < b.x + b.size &&
    a.x + a.size > b.x &&
    a.y < b.y + b.size &&
    a.y + a.size > b.y
  );
}

let mobKillCount = 0;
let firstDoubleKillNotified = false;
let pentaKillNotified = false;


function attack() {
  const reach = player.weapon.reach;
  const damage = player.weapon.damage;

  currentRoom.mobs.forEach(mob => {
    const dx = mob.x + mob.size / 2 - (player.x + player.size / 2);
    const dy = mob.y + mob.size / 2 - (player.y + player.size / 2);
    const distance = Math.hypot(dx, dy);

    if (distance <= reach) {
      mob.hp -= damage;
      if (mob.hp <= 0 && !mob.markedForDeath) {
        mob.markedForDeath = true; // evitar contar a mesma morte mais de uma vez
        droppedItems.push(new DroppedItem(mob.x, mob.y, potion));
        mobKillCount++;

        // Notificações
        if (mobKillCount === 2 && !firstDoubleKillNotified) {
          showNotification("Você foi o primeiro a matar dois monstros!");
          firstDoubleKillNotified = true;
        }

        if (mobKillCount === 5 && !pentaKillNotified) {
          showNotification("Pentakill! Você é um guerreiro incrível!");
          pentaKillNotified = true;
        }
      }
    }
  });
}

function showNotification(text) {
  const notification = document.createElement("div");
  notification.textContent = text;
  notification.style.position = "absolute";
  notification.style.top = "20px";
  notification.style.left = "50%";
  notification.style.transform = "translateX(-50%)";
  notification.style.background = "black";
  notification.style.color = "white";
  notification.style.padding = "10px 20px";
  notification.style.border = "2px solid white";
  notification.style.fontSize = "18px";
  notification.style.zIndex = 1000;
  notification.style.borderRadius = "10px";
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}



function update() {
  if (inventoryOpen) return; // pausa movimentação e lógica quando inventário aberto

  droppedItems = droppedItems.filter(dropped => {
    if (dropped.isPickedUp(player)) {
      if (inventory.addItem(dropped.item)) {
        showNotification(`Você pegou: ${dropped.item.name}`);
        return false; // remove da lista
      } else {
        showNotification("Inventário cheio!");
        return true;
      }
    }
    return true;
  });

  // Movimento do player
  const speed = 3;
  let nextX = player.x;
  let nextY = player.y;

  if (keys["w"]) nextY -= speed;
  if (keys["s"]) nextY += speed;
  if (keys["a"]) nextX -= speed;
  if (keys["d"]) nextX += speed;

  if (canMoveTo(nextX, player.y, player.size)) player.x = nextX;
  if (canMoveTo(player.x, nextY, player.size)) player.y = nextY;

  // Atualiza mobs e remove os mortos
  currentRoom.mobs = currentRoom.mobs.filter(mob => {
    mob.update();
    return mob.hp > 0;
  });

  // Checa colisão e dano do player
  currentRoom.mobs.forEach(mob => {
    if (isColliding(player, mob) && !player.invincible) {
      player.hp -= 10;
      player.invincible = true;
      setTimeout(() => player.invincible = false, 1000);
    }
  });


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
  droppedItems.forEach(item => item.draw());


  currentRoom.mobs.forEach(mob => mob.draw());

  drawFace(player.x + player.size / 2, player.y + player.size / 2);
  // Espada como linha reta apontada para o mouse
  const angle = Math.atan2(mouse.y - (player.y + player.size / 2), mouse.x - (player.x + player.size / 2));
  const swordLength = 25;
  const swordX1 = player.x + player.size * 0.75;
  const swordY1 = player.y + player.size * 0.85;
  const swordX2 = swordX1 + Math.cos(angle) * swordLength;
  const swordY2 = swordY1 + Math.sin(angle) * swordLength;

  ctx.strokeStyle = "silver";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(swordX1, swordY1);
  ctx.lineTo(swordX2, swordY2);
  ctx.stroke();


  // Barra de vida com texto
  ctx.fillStyle = "black";
  ctx.fillRect(20, 20, 104, 24);

  ctx.fillStyle = "red";
  ctx.fillRect(22, 22, (player.hp / player.maxHp) * 100, 20);

  ctx.strokeStyle = "white";
  ctx.strokeRect(20, 20, 104, 24);

  // Texto HP
  ctx.font = "16px Arial";
  ctx.fillStyle = "white";
  ctx.fillText(`HP: ${player.hp} / ${player.maxHp}`, 130, 38);


  console.log("Mobs nesta sala:", currentRoom.mobs.length);
}

function drawInventory() {
  // Fundo semi-transparente
  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.fillRect(50, 50, 400, 400);

  ctx.fillStyle = "white";
  ctx.font = "18px Arial";
  ctx.fillText("Inventário", 60, 80);

  const slotSize = 50;
  const padding = 10;

  inventory.items.forEach((item, i) => {
    const x = 60 + (i % 5) * (slotSize + padding);
    const y = 100 + Math.floor(i / 5) * (slotSize + padding);

    ctx.fillStyle = "#444";
    ctx.fillRect(x, y, slotSize, slotSize);

    ctx.fillStyle = "white";
    ctx.fillText(item.name, x + 5, y + 20);
    if (item.stackable && item.quantity > 1) {
      ctx.fillText(`x${item.quantity}`, x + 5, y + 40);
    }
  });
}

// Ajuste a função para aceitar item ID correto (potion)
function useItem(itemId) {
  if (itemId === "potion") {
    if (player.hp < player.maxHp) {
      player.hp = Math.min(player.hp + 15, player.maxHp); // 15 conforme descrição
      showNotification("Poção de vida usada! +15 HP");
      return true;
    } else {
      showNotification("HP já está cheio!");
      return false;
    }
  }
  return false;
}

// Adicione este método à classe Inventory
Inventory.prototype.useItem = function(itemId) {
  const itemIndex = this.items.findIndex(i => i.id === itemId);
  if (itemIndex === -1) return false;

  const item = this.items[itemIndex];
  if (useItem(item.id)) { // chama a função global que aplica o efeito
    // Se for empilhável, diminui a quantidade
    if (item.stackable) {
      item.quantity--;
      if (item.quantity <= 0) this.items.splice(itemIndex, 1);
    } else {
      this.items.splice(itemIndex, 1);
    }
    return true;
  }
  return false;
}

// Corrija o listener para:
document.addEventListener("keydown", (event) => {
  if (event.key === "1") {
    if (inventory.useItem("potion")) {
      // Poção usada e removida dentro do método inventory.useItem
    }
  }
});

 

canvas.addEventListener("click", e => {
  if (!inventoryOpen) return;

  const rect = canvas.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;

  const slotSize = 50;
  const padding = 10;

  for (let i = 0; i < inventory.items.length; i++) {
    const x = 60 + (i % 5) * (slotSize + padding);
    const y = 100 + Math.floor(i / 5) * (slotSize + padding);

    if (
      clickX >= x && clickX <= x + slotSize &&
      clickY >= y && clickY <= y + slotSize
    ) {
      showItemDetails(inventory.items[i]);
      break;
    }
  }
});

function showItemDetails(item) {
  ctx.fillStyle = "rgba(0,0,0,0.8)";
  ctx.fillRect(470, 50, 300, 200);

  ctx.fillStyle = "white";
  ctx.font = "16px Arial";
  ctx.fillText(`Nome: ${item.name}`, 480, 80);
  ctx.fillText(`Descrição: ${item.description}`, 480, 110);

  if (item.attributes.damage) {
    ctx.fillText(`Dano: ${item.attributes.damage[0]} - ${item.attributes.damage[1]}`, 480, 140);
  }
  if (item.attributes.heal) {
    ctx.fillText(`Cura: ${item.attributes.heal}`, 480, 140);
  }
}


function gameLoop() {
  update();
  drawRoom();

  if (inventoryOpen) {
    drawInventory();
  }
  requestAnimationFrame(gameLoop);
}

function drawTileMap() {
  const cols = Math.ceil(canvas.width / TILE);
  const rows = Math.ceil(canvas.height / TILE);
  collisionMap = [];

  for (let y = 0; y < rows; y++) {
    const row = [];
    for (let x = 0; x < cols; x++) {
      let tileId = 0;

      if (y === 0 || y === rows - 1 || x === 0 || x === cols - 1) tileId = 1;

      const midX = Math.floor(cols / 2);
      const midY = Math.floor(rows / 2);
      if (currentRoom.connections.top && y === 0 && (x === midX || x === midX - 1 || x === midX + 1)) tileId = 2;
      if (currentRoom.connections.bottom && y === rows - 1 && (x === midX || x === midX - 1 || x === midX + 1)) tileId = 2;
      if (currentRoom.connections.left && x === 0 && (y === midY || y === midY - 1 || y === midY + 1)) tileId = 2;
      if (currentRoom.connections.right && x === cols - 1 && (y === midY || y === midY - 1 || y === midY + 1)) tileId = 2;

      const img = tileImages[tileId];
      ctx.drawImage(img, x * TILE, y * TILE, TILE, TILE);

      row.push(tileId);
    }
    collisionMap.push(row);
  }
}



function canMoveTo(x, y, size) {
  const corners = [
    [x, y],
    [x + size - 1, y],
    [x, y + size - 1],
    [x + size - 1, y + size - 1]
  ];

  return corners.every(([cx, cy]) => {
    const tileX = Math.floor(cx / TILE);
    const tileY = Math.floor(cy / TILE);
    const tile = collisionMap[tileY]?.[tileX];
    return tile !== 1; // 1 = parede, bloqueia
  });
}



function drawTutorial() {
  const lines = [
    "Use W A S D para se mover.",
    "Clique com o botão esquerdo (M1) para atacar.",
    "Mobs podem dropar itens ao morrer.",
    "Mate o chefe final para completar o jogo!"
  ];

  ctx.font = "20px Arial";
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";

  lines.forEach((line, i) => {
    const textX = 50;
    const textY = 100 + i * 30;
    ctx.strokeText(line, textX, textY);
    ctx.fillText(line, textX, textY);
  });
}

class DroppedItem {
  constructor(x, y, item) {
    this.x = x;
    this.y = y;
    this.size = 20; // tamanho do quadrado no chão
    this.item = item;
  }

  draw() {
    ctx.fillStyle = "green"; // cor para a poção, você pode usar uma imagem também
    ctx.fillRect(this.x, this.y, this.size, this.size);

    ctx.fillStyle = "white";
    ctx.font = "14px Arial";
    ctx.fillText(this.item.name, this.x, this.y - 5);
  }

  isPickedUp(player) {
    return isColliding(this, player);
  }
}


class Mob {
  constructor(x, y, color = "red") {
    this.x = x;
    this.y = y;
    this.size = 28;
    this.color = color;
    this.speed = 1;

    this.maxHp = 50;
    this.hp = this.maxHp;
  }

  draw() {
    // Corpo do mob (quadrado vermelho)
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);

    // Barra de vida
    ctx.fillStyle = "black";
    ctx.fillRect(this.x, this.y - 8, this.size, 6);
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y - 8, (this.hp / this.maxHp) * this.size, 6);
    ctx.strokeStyle = "white";
    ctx.strokeRect(this.x, this.y - 8, this.size, 6);

    // Olhos raivosos
    const eyeSize = 6;
    const eyeY = this.y + 8;
    const leftEyeX = this.x + 6;
    const rightEyeX = this.x + this.size - 12;

    // Fundo branco dos olhos
    ctx.fillStyle = "white";
    ctx.fillRect(leftEyeX, eyeY, eyeSize, eyeSize);
    ctx.fillRect(rightEyeX, eyeY, eyeSize, eyeSize);

    // Pupilas pretas
    ctx.fillStyle = "black";
    ctx.fillRect(leftEyeX + 2, eyeY + 2, 2, 2);
    ctx.fillRect(rightEyeX + 2, eyeY + 2, 2, 2);

    // Sobrancelhas inclinadas para dar raiva
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    // Sobrancelha esquerda (da esquerda para direita inclinada para baixo)
    ctx.beginPath();
    ctx.moveTo(leftEyeX, eyeY);
    ctx.lineTo(leftEyeX + eyeSize, eyeY - 4);
    ctx.stroke();

    // Sobrancelha direita (da direita para esquerda inclinada para baixo)
    ctx.beginPath();
    ctx.moveTo(rightEyeX + eyeSize, eyeY);
    ctx.lineTo(rightEyeX, eyeY - 4);
    ctx.stroke();
  }

  update() {
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 1) {
      this.x += (dx / dist) * this.speed;
      this.y += (dy / dist) * this.speed;
    }
  }
}




function drawFace(x, y) {
  // Cabeça
  ctx.fillStyle = "#FFD1A4";
  ctx.beginPath();
  ctx.arc(x, y, 16, 0, Math.PI * 2);
  ctx.fill();

  // Olhos
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(x - 5, y - 5, 2, 0, Math.PI * 2);
  ctx.arc(x + 5, y - 5, 2, 0, Math.PI * 2);
  ctx.fill();

  // Boca
  ctx.strokeStyle = "black";
  ctx.beginPath();
  ctx.arc(x, y + 4, 6, 0, Math.PI);
  ctx.stroke();
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
