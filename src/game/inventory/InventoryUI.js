export class InventoryUI {
  constructor(inventory, containerId = 'inventory-container') {
    this.inventory = inventory;
    this.container = document.getElementById(containerId);
    this.slotSize = 64;
    this.render();
  }

  render() {
    this.container.innerHTML = '';
    
    // Cria os slots do inventário
    for (let i = 0; i < this.inventory.maxSlots; i++) {
      const slot = document.createElement('div');
      slot.className = 'inventory-slot';
      slot.dataset.slotIndex = i;
      
      // Adiciona item se existir
      if (i < this.inventory.items.length) {
        const item = this.inventory.items[i];
        const itemElement = this.createItemElement(item);
        slot.appendChild(itemElement);
      }
      
      this.container.appendChild(slot);
    }
  }

  createItemElement(item) {
    const itemElement = document.createElement('div');
    itemElement.className = 'inventory-item';
    itemElement.dataset.itemId = item.id;
    itemElement.title = `${item.name}\n${item.description}`;
    
    // Ícone do item
    const icon = document.createElement('img');
    icon.src = this.getItemIcon(item.type);
    icon.alt = item.name;
    itemElement.appendChild(icon);
    
    // Quantidade (se aplicável)
    if (item.quantity > 1) {
      const quantity = document.createElement('span');
      quantity.className = 'item-quantity';
      quantity.textContent = item.quantity;
      itemElement.appendChild(quantity);
    }
    
    return itemElement;
  }

  getItemIcon(itemType) {
    const icons = {
      key: '/assets/sprites/key.png',
      sword: '/assets/sprites/sword.png',
      coin: '/assets/sprites/coin.png'
    };
    return icons[itemType] || '/assets/sprites/unknown.png';
  }

  update() {
    this.render();
  }
}