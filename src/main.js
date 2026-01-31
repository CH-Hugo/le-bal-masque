import { mooveplayer } from './player1.js';
import { createplayer } from './player1.js';

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: '#000000',
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 0 },
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
    createplayer.call(this);
  // la nos objets genre joueur, collisions etc...
}

function update() {
    mooveplayer.call(this);
  // ici tout ce qui va se jouer a chaque frame
}