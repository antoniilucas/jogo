export class Inventory {
  constructor(maxSlots) {
    this.maxSlots = maxSlots;
    this.items = [];
  }

  addItem(item) {
    // Verifica se o item já existe no inventário (para moedas, chaves, etc.)
    const existingItem = this.items.find(i => i.id === item.id && i.type === item.type);
    
    if (existingItem) {
      existingItem.quantity += item.quantity;
      return true;
    }
    
    if (this.items.length < this.maxSlots) {
      this.items.push(item);
      return true;
    }
    
    return false; // Inventário cheio
  }

  removeItem(itemId) {
    const index = this.items.findIndex(item => item.id === itemId);
    if (index !== -1) {
      this.items.splice(index, 1);
      return true;
    }
    return false;
  }

  getItems() {
    return this.items;
  }
}