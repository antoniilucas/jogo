export class CollisionDetector {
  static checkCollision(obj1, obj2) {
    return (
      obj1.x < obj2.x + obj2.width &&
      obj1.x + obj1.width > obj2.x &&
      obj1.y < obj2.y + obj2.height &&
      obj1.y + obj1.height > obj2.y
    );
  }

  static checkTileCollision(obj, tileMap, tileSize) {
    const left = Math.floor(obj.x / tileSize);
    const right = Math.floor((obj.x + obj.width) / tileSize);
    const top = Math.floor(obj.y / tileSize);
    const bottom = Math.floor((obj.y + obj.height) / tileSize);

    for (let y = top; y <= bottom; y++) {
      for (let x = left; x <= right; x++) {
        if (tileMap[y] && tileMap[y][x] && tileMap[y][x].isSolid) {
          return true;
        }
      }
    }
    return false;
  }
}