import { movePlayer } from './player1.js';
import { createPlayer } from './player1.js';
import { createBoss } from './ennemis/boss.js';
import { moovBoss } from './ennemis/boss.js';
import { jumpBoss } from './ennemis/boss.js';


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
  // ici mon mets nos assets img, sons, maps etc...
}

function create() {
    createPlayer.call(this);
    createBoss.call(this);
    this.jumpBoss = jumpBoss.bind(this);
}

function update() {
    movePlayer.call(this);
    moovBoss.call(this);
  // ici tout ce qui va se jouer a chaque frame
}
