import Phaser from 'phaser';

const ASSETS = {
  BACKGROUND: require('./assets/background.png') as string,
  DRAGON: require('./assets/dragon.png') as string,
  PLAYER: require('./assets/player.png') as string,
  TREASURE: require('./assets/treasure.png') as string,
};

export default class GameScene extends Phaser.Scene {
  private player: Phaser.GameObjects.Sprite;
  private treasure: Phaser.GameObjects.Sprite;
  private playerSpeed: number;

  constructor() {
    super('Game');
  }

  init() {
    this.playerSpeed = 3;
  }

  preload() {
    this.load.image('background', ASSETS.BACKGROUND);
    this.load.image('player', ASSETS.PLAYER);
    this.load.image('treasure', ASSETS.TREASURE);

  }

  create() {
    const background = this.add.image(0, 0, 'background');
    const gameWidth = parseInt(this.sys.game.config.width.toString());
    const gameHeight = parseInt(this.sys.game.config.height.toString());
    background.setPosition(gameWidth / 2, gameHeight / 2);

    this.player = this.add.sprite(70, gameHeight / 2, 'player');
    this.player.setScale(0.5);

    this.treasure = this.add.sprite(gameWidth - 80, gameHeight / 2, 'treasure');
    this.treasure.setScale(0.6);
  }

  update() {
    if (this.input.activePointer.isDown) {
      this.player.x += this.playerSpeed;
    }

    const playerBounds = this.player.getBounds();
    const treasureBounds = this.treasure.getBounds();

    if (Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, treasureBounds)) {
      console.log('Reached the treasure!')
      this.scene.restart();
    }
  }
}

const config : Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'phaser-game-canvas',
  width: 640,
  height: 360,
  scene: GameScene,
};

const game = new Phaser.Game(config);
