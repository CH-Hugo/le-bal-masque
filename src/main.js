<<<<<<< HEAD
import { createboss } from './boss.js';
import { mooveplayer } from './player1.js';
import { createplayer } from './player1.js';
import { createboss } from './boss.js';
=======
import { movePlayer } from './player1.js';
import { createPlayer } from './player1.js';
>>>>>>> 05450c918d3e335fdc48d41e86158a1e5df40c51

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
<<<<<<< HEAD
    createplayer.call(this);
    createboss.call(this);
=======
    createPlayer.call(this);
>>>>>>> 05450c918d3e335fdc48d41e86158a1e5df40c51
  // la nos objets genre joueur, collisions etc...
}

function update() {
    movePlayer.call(this);
  // ici tout ce qui va se jouer a chaque frame
}
