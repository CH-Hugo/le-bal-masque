import { movePlayer, createPlayer } from './player1.js';
import { createBoss, moveBoss, jumpBoss } from './ennemis/boss.js';
import { createLevel } from './level.js';
import {setupCamera} from'./camera.js';

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth,
        height: window.innerHeight,
    },
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 600 }, debug: false }
    },
    scene: { preload, create, update }
};

new Phaser.Game(config);

function preload() {
    this.load.tilemapTiledJSON('maMap', 'assets/map.json'); 
    this.load.image('mesTuiles', 'assets/fond.jpg'); 
    this.load.image('texturePlateforme', 'assets/pixels.jpg');
}

function create() {
    const { map, sol } = createLevel.call(this); 

    createPlayer.call(this);
    createBoss.call(this);

    if (this.player && sol) {
        this.physics.add.collider(this.player, sol);
    }
    if (this.boss && sol) {
        this.physics.add.collider(this.boss, sol);
    }

    setupCamera.call(this, map); 

    this.jumpBoss = jumpBoss.bind(this);
}

function update() {
    movePlayer.call(this);
    moveBoss.call(this);
}