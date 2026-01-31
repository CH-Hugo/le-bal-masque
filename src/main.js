import { movePlayer, createPlayer, handlePlayerDamage } from './player1.js';
import { createBoss, jumpBoss, moveBoss, attackBoss, detectPlayer } from './ennemis/boss.js';
import { createLevel } from './level.js';
import { setupCamera } from './camera.js';

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
    render: { pixelArt: true }, // Indispensable pour tes nouveaux sprites
    scene: { preload, create, update }
};

new Phaser.Game(config);

function preload() {
    this.load.tilemapTiledJSON('maMap', 'assets/map.json'); 
    this.load.image('mesTuiles', 'assets/fond.jpg'); 
    this.load.image('texturePlateforme', 'assets/pixels.jpg');
    this.load.image('coeur', 'assets/coeur.png');
    
    // Tes spritesheets avec les bons découpages
    this.load.spritesheet('perso_marche', 'assets/marche.png', { frameWidth: 30, frameHeight: 32 });
    this.load.spritesheet('perso', 'assets/perso.png', { frameWidth: 24, frameHeight: 30 });
    
    // N'oublie pas de charger l'image du boss si ce n'est pas déjà fait ailleurs
    this.load.image('boss', 'assets/boss.png'); 
}

function create() {
    const { map, sol } = createLevel.call(this); 

    // --- 1. TES ANIMATIONS ---
    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('perso', { start: 0, end: 2 }),
        frameRate: 6,
        repeat: -1
    });

    this.anims.create({
        key: 'marche', 
        frames: this.anims.generateFrameNumbers('perso_marche', { start: 0, end: 2 }),
        frameRate: 10,
        repeat: -1
    });

    // --- 2. CRÉATION DES PERSONNAGES ---
    createPlayer.call(this);
    createBoss.call(this);

    // --- 3. COLLISIONS ET DÉGÂTS (Fusionné) ---
    if (this.player && sol) {
        this.physics.add.collider(this.player, sol);
    }
    if (this.boss && sol){
        this.physics.add.collider(this.boss, sol);
    }

    // Ajout de la détection des dégâts (Sa fonctionnalité)
    this.physics.add.overlap(this.player, this.boss, handlePlayerDamage, null, this);

    setupCamera.call(this, map); 

    // Liaison des fonctions du boss
    this.jumpBoss = jumpBoss.bind(this);
    this.attackBoss = attackBoss.bind(this);
    this.detectPlayer = detectPlayer.bind(this);

    // --- 4. TIMERS (Fusionnés) ---
    this.time.addEvent({
        delay: 1500,
        callback: () => { this.jumpBoss(); },
        loop: true
    });

    this.time.addEvent({
        delay: 3000,
        loop: true,
        callback: () => {
            this.bossIsAttacking = !this.bossIsAttacking;

            if(this.bossIsAttacking){
                console.log("Boss attaque !");
                // Sa ligne cruciale : on autorise le boss à blesser à nouveau
                this.bossHasHit = false; 
            } else {
                console.log("Boss se repose !");
                if(this.boss) {
                    this.boss.setVelocityX(this.bossSpeed);
                }
            }
        }
    });
}

function update() {
    movePlayer.call(this);
    moveBoss.call(this);
    this.detectPlayer();
}