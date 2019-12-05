import Phaser from 'phaser';

const ASSETS = {
  BACKGROUND: require('./assets/background.png') as string,
  DRAGON: require('./assets/dragon.png') as string,
  PLAYER: require('./assets/player.png') as string,
  TREASURE: require('./assets/treasure.png') as string,
};

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  preload() {
    this.load.image('background', ASSETS.BACKGROUND);
    this.load.image('player', ASSETS.PLAYER);
    this.load.image('enemy', ASSETS.DRAGON);

  }

  create() {
    const background = this.add.image(0, 0, 'background');
    const gameWidth = parseInt(this.sys.game.config.width.toString());
    const gameHeight = parseInt(this.sys.game.config.height.toString());
    background.setPosition(gameWidth / 2, gameHeight / 2);

    const player = this.add.sprite(70, 180, 'player');
    player.setScale(0.5, 2);

    const enemyOne = this.add.sprite(250, 180, 'enemy');
    enemyOne.scaleX = 2;
    enemyOne.scaleY = 2;
    enemyOne.flipX = true;
    enemyOne.flipY = true;

    const enemyTwo = this.add.sprite(450, 180, 'enemy');
    enemyTwo.displayWidth = 300;

  }

  update() {}
}

const config : Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'phaser-game-canvas',
  width: 640,
  height: 360,
  scene: GameScene,
};

const game = new Phaser.Game(config);
