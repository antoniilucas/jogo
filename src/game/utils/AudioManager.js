export class AudioManager {
  constructor() {
    this.sounds = {
      collect: {
        key: new Audio('/assets/sounds/collect_key.mp3'),
        coin: new Audio('/assets/sounds/collect_coin.mp3'),
        sword: new Audio('/assets/sounds/collect_sword.mp3')
      },
      music: {
        level: new Audio('/assets/sounds/level_music.mp3'),
        boss: new Audio('/assets/sounds/boss_music.mp3')
      }
    };
  }

  playCollectSound(itemType) {
    switch(itemType) {
      case 'key':
        this.sounds.collect.key.currentTime = 0;
        this.sounds.collect.key.play();
        break;
      case 'coin':
        this.sounds.collect.coin.currentTime = 0;
        this.sounds.collect.coin.play();
        break;
      case 'sword':
        this.sounds.collect.sword.currentTime = 0;
        this.sounds.collect.sword.play();
        break;
    }
  }

  playBossMusic() {
    this.stopMusic();
    this.sounds.music.boss.loop = true;
    this.sounds.music.boss.play();
  }

  playLevelMusic() {
    this.stopMusic();
    this.sounds.music.level.loop = true;
    this.sounds.music.level.play();
  }

  stopMusic() {
    this.sounds.music.boss.pause();
    this.sounds.music.level.pause();
  }
}