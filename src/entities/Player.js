export class Player {
  constructor(id, x, y, isCurrentPlayer = false) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.width = 32;
    this.height = 32;
    this.speed = 5;
    this.level = 1;
    this.experience = 0;
    this.isCurrentPlayer = isCurrentPlayer;
    this.inventory = new Inventory(10); // 10 slots
  }

  move(direction) {
    // Lógica de movimento básica
    switch(direction) {
      case 'up': this.y -= this.speed; break;
      case 'down': this.y += this.speed; break;
      case 'left': this.x -= this.speed; break;
      case 'right': this.x += this.speed; break;
    }
  }

  addExperience(amount) {
    this.experience += amount;
    const expNeeded = this.level * 100;
    if (this.experience >= expNeeded) {
      this.levelUp();
    }
  }

  levelUp() {
    this.level++;
    this.experience = 0;
    this.speed += 0.5;
    // Outras melhorias de nível
  }

  collectItem(item) {
    return this.inventory.addItem(item);
  }
}