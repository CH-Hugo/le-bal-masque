import { mooveplayer } from './mooveplayer.js';

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
        this.player = this.add.rectangle(100, 100, 50, 50, 0x00ff00);
        this.player.y = window.innerHeight / 2;
        this.player.x = window.innerWidth / 2;
        this.physics.add.existing(this.player);

        this.cursors = this.input.keyboard.createCursorKeys();
  // la nos objets genre joueur, collisions etc...
}

function update() {
    mooveplayer.call(this);
  // ici tout ce qui va se jouer a chaque frame
}