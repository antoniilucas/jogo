export class CollectableItem {
  static ITEM_TYPES = {
    KEY: 'key',
    SWORD: 'sword',
    COIN: 'coin'
  };

  constructor(type, x, y, properties = {}) {
    this.id = `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.type = type;
    this.x = x;
    this.y = y;
    this.width = 16;
    this.height = 16;
    this.collected = false;
    
    // Propriedades específicas do item
    this.name = properties.name || this.getDefaultName();
    this.description = properties.description || this.getDefaultDescription();
    this.quantity = properties.quantity || 1;
    
    // Para espadas
    if (type === CollectableItem.ITEM_TYPES.SWORD) {
      this.level = properties.level || 1;
      this.damage = 10 * this.level;
    }
  }

  getDefaultName() {
    switch(this.type) {
      case CollectableItem.ITEM_TYPES.KEY: return "Chave Comum";
      case CollectableItem.ITEM_TYPES.SWORD: return `Espada Nível ${this.level || 1}`;
      case CollectableItem.ITEM_TYPES.COIN: return "Moeda";
      default: return "Item Desconhecido";
    }
  }

  getDefaultDescription() {
    switch(this.type) {
      case CollectableItem.ITEM_TYPES.KEY: return "Uma chave que pode abrir portas misteriosas.";
      case CollectableItem.ITEM_TYPES.SWORD: return `Uma espada poderosa que causa ${this.damage} de dano.`;
      case CollectableItem.ITEM_TYPES.COIN: return "Moeda valiosa para comprar itens.";
      default: return "Um item misterioso.";
    }
  }
}