const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: '#000000',
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
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
  // la nos objets genre joueur, collisions etc...
}

function update() {
  // ici tout ce qui va se jouer comme les mouvements fights etc...
}