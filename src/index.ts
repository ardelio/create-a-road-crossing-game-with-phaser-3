import Phaser from 'phaser';

const ASSETS = {
  BACKGROUND: require('./assets/background.png') as string,
  DRAGON: require('./assets/dragon.png') as string,
  PLAYER: require('./assets/player.png') as string,
  TREASURE: require('./assets/treasure.png') as string,
};

export default class GameScene extends Phaser.Scene {
  private player: Phaser.GameObjects.Sprite;
  private enemies: Phaser.GameObjects.Group;
  private treasure: Phaser.GameObjects.Sprite;
  private playerSpeed: number;
  private enemyMinSpeed: number;
  private enemyMaxSpeed: number;
  private enemyMinY: number;
  private enemyMaxY: number;

  constructor() {
    super('Game');
  }

  init() {
    this.playerSpeed = 3;
    this.enemyMinSpeed = 2;
    this.enemyMaxSpeed = 4.5;
    this.enemyMinY = 80;
    this.enemyMaxY = 280;
  }

  preload() {
    this.load.image('background', ASSETS.BACKGROUND);
    this.load.image('player', ASSETS.PLAYER);
    this.load.image('dragon', ASSETS.DRAGON);
    this.load.image('treasure', ASSETS.TREASURE);

  }

  create() {
    const background = this.add.image(0, 0, 'background');
    const gameWidth = parseInt(this.sys.game.config.width.toString());
    const gameHeight = parseInt(this.sys.game.config.height.toString());
    background.setPosition(gameWidth / 2, gameHeight / 2);

    this.player = this.add.sprite(30, gameHeight / 2, 'player');
    this.player.setScale(0.5);

    this.treasure = this.add.sprite(gameWidth - 80, gameHeight / 2, 'treasure');
    this.treasure.setScale(0.6);

    const groupCreateConfig : Phaser.Types.GameObjects.Group.GroupCreateConfig = {
      key: 'dragon',
      repeat: 5,
      setXY: {
        x: 90,
        y: 100,
        stepX: 80,
        stepY: 20,
      }
    };

    this.enemies = this.add.group(groupCreateConfig);

    Phaser.Actions.ScaleXY(this.enemies.getChildren(), -0.4, -0.4);
    this.enemies.getChildren().forEach((enemy : Phaser.GameObjects.Sprite) => {
      enemy.flipX = true;
      const direction = Math.random() < 0.5 ? 1 : -1;
      const speed = this.enemyMinSpeed + Math.random() * (this.enemyMaxSpeed - this.enemyMinSpeed);
      (enemy as any).velocity = direction * speed;
    });
  }

  update() {
    if (this.input.activePointer.isDown) {
      this.player.x += this.playerSpeed;
    }

    const playerRectangle = this.player.getBounds();
    const treasureRectangle = this.treasure.getBounds();

    if (Phaser.Geom.Intersects.RectangleToRectangle(playerRectangle, treasureRectangle)) {
      console.log('Reached the treasure!')
      this.scene.restart();
    }

    this.enemies.getChildren().forEach((enemy : Phaser.GameObjects.Sprite) => {
      enemy.y += (enemy as any).velocity;

      const conditionUp = (enemy as any).velocity < 0 && enemy.y <= this.enemyMinY;
      const conditionDown = (enemy as any).velocity > 0 && enemy.y >= this.enemyMaxY

      if (conditionDown || conditionUp) {
        (enemy as any).velocity *= -1;
      }

      const enemyRectangle = enemy.getBounds();

      if (Phaser.Geom.Intersects.RectangleToRectangle(playerRectangle, enemyRectangle)) {
        console.log('Game over!');

        this.scene.restart();
      }
    });
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
