// import { createboss } from './boss.js';
import { movePlayer } from './player1.js';
import { createPlayer } from './player1.js';

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
}

function create() {
    const map = this.make.tilemap({ key: 'maMap' });
    
    const tileset = map.addTilesetImage('fond', 'mesTuiles');

    const sol = map.createLayer('Calque de Tuiles 1', tileset, 0, 0);

    if (sol) {
        sol.setCollisionByProperty({ collides: true });
    }

    createPlayer.call(this);

    if (this.player && sol) {
        this.physics.add.collider(this.player, sol);
    }
}

function update() {
    movePlayer.call(this);
}