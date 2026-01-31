import { movePlayer } from './player1.js';
import { createPlayer } from './player1.js';
import { createBoss } from './ennemis/boss.js';
import { jumpBoss } from './ennemis/boss.js';
import { moveBoss } from './ennemis/boss.js';


const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: '#000000',
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 600 },
        debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: {
    preload,
    create,
    update
  }
};

new Phaser.Game(config);

function preload() {
    this.load.tilemapTiledJSON('maMap', 'assets/map.json'); 
    this.load.image('mesTuiles', 'assets/fond.jpg'); 
    this.load.image('texturePlateforme', 'assets/pixels.jpg'); 
}

function create() {
    const map = this.make.tilemap({ key: 'maMap' });

    const tilesetFond = map.addTilesetImage('fond', 'mesTuiles');
    const tilesetPlateforme = map.addTilesetImage('pixels', 'texturePlateforme');
    const sol = map.createLayer('Calque de Tuiles 1', [tilesetFond, tilesetPlateforme], 0, 0);

    if (sol) {
        sol.setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);
        sol.setCollisionByProperty({ collides: true });
    }

    createPlayer.call(this);
    createBoss.call(this);

    this.physics.add.collider(this.player, sol);
    this.physics.add.collider(this.boss, sol);

    this.jumpBoss = jumpBoss.bind(this);
}

function update() {
    movePlayer.call(this);
    moveBoss.call(this);
}