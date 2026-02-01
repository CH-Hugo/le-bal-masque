import { movePlayer, createPlayer, handlePlayerDamage } from './player1.js';
import { 
    createBoss, 
    moveBoss,
    detectPlayer, 
    attackCharge,
    attackJump,
    attackArea,
    chooseBossAttack
} from './ennemis/boss.js';
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
    render: { pixelArt: true },
    scene: { preload, create, update }
};

new Phaser.Game(config);

function preload() {
    this.load.tilemapTiledJSON('maMap', 'assets/map.json'); 
    this.load.image('mesTuiles', 'assets/fond.jpg'); 
    this.load.image('texturePlateforme', 'assets/pixels.jpg');
    this.load.image('coeur', 'assets/coeur.png');

    // ✔ CORRECTION MINIMALE : remettre ton vampire
    this.load.spritesheet('perso', 'assets/perso.png', { frameWidth: 24, frameHeight: 30 });

    this.load.spritesheet('perso_marche', 'assets/marche.png', { frameWidth: 30, frameHeight: 32 });
    this.load.image('boss', 'assets/boss.png'); 
}

function create() {
    const { map, sol } = createLevel.call(this);

    createPlayer.call(this);
    createBoss.call(this);

    if (this.player && sol) this.physics.add.collider(this.player, sol);
    if (this.boss && sol) this.physics.add.collider(this.boss, sol);

    // ✔ CORRECTION MINIMALE : utiliser handlePlayerDamage
    this.physics.add.overlap(
        this.player,
        this.boss,
        handlePlayerDamage,
        null,
        this
    );

    setupCamera.call(this, map);

    this.attackCharge = attackCharge.bind(this);
    this.attackJump = attackJump.bind(this);
    this.attackArea = attackArea.bind(this);
    this.chooseBossAttack = chooseBossAttack.bind(this);
    this.detectPlayer = detectPlayer.bind(this);

    this.time.addEvent({
        delay: 3000,
        loop: true,
        callback: () => {
            this.bossIsAttacking = !this.bossIsAttacking;

            if (this.bossIsAttacking) {
                console.log("Boss peut attaquer !");
            } else {
                console.log("Boss se repose !");
                this.bossIsCurrentlyAttacking = false;
                this.bossHasHit = false;
                this.boss.setVelocityX(this.bossSpeed);
            }
        }
    });
}

function update() {
    movePlayer.call(this);
    moveBoss.call(this);
    this.detectPlayer();
}