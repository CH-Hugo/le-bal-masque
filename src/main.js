import { movePlayer } from './player1.js';
import { createPlayer } from './player1.js';
import { createBoss } from './ennemis/boss.js';
import { jumpBoss } from './ennemis/boss.js';
import { moveBoss } from './ennemis/boss.js';
import { attackBoss } from './ennemis/boss.js';
import { detectPlayer } from './ennemis/boss.js';
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
    this.load.image('coeur', 'assets/coeur.png');
}

function create() {
    const { map, sol } = createLevel.call(this); 

    createPlayer.call(this);
    createBoss.call(this);

    if (this.player && sol) {
        this.physics.add.collider(this.player, sol);
    }

    setupCamera.call(this, map); 

    if (this.boss &&sol){
      this.physics.add.collider(this.boss, sol);
    }
    this.jumpBoss = jumpBoss.bind(this);
    this.attackBoss = attackBoss.bind(this);
    this.detectPlayer = detectPlayer.bind(this);

    //Timer pour les sauts
    this.time.addEvent({
        delay:1500, //toutes les 1.5 secondes
        callback: () => {
            this.jumpBoss();
        },
        loop: true
    });

    //timer pour les attaques sur le player
    this.time.addEvent({
        delay:3000, //toutes les 3 secondes
        loop: true,
        callback: () => {
          this.bossIsAttacking = !this.bossIsAttacking;

          if(this.bossIsAttacking){
            console.log("Boss attaque !");
          } else {
            console.log("Bosse se repose !");
            this.boss.setVelocityX(this.bossSpeed); //retour au mouvement normal
          }
        }
      });

}

function update() {
    movePlayer.call(this);
    moveBoss.call(this);
    this.detectPlayer();
  // ici tout ce qui va se jouer a chaque frame
}