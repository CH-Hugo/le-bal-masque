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
    
    // Tileset correct
    this.load.image('mesTuiles', 'assets/Sprite-0001-Sheet.png'); 
    this.load.image('texturePlateforme', 'assets/pixels.jpg');
    this.load.image('coeur', 'assets/coeur.png');

    // Ton vampire (corrigé)
    this.load.spritesheet('perso', 'assets/perso.png', { frameWidth: 24, frameHeight: 30 });
    this.load.spritesheet('perso_marche', 'assets/marche.png', { frameWidth: 30, frameHeight: 32 });

    // Anim dégâts
    this.load.spritesheet('degats', 'assets/degats.png', { frameWidth: 46, frameHeight: 32 });

    // Boss
    this.load.image('boss', 'assets/boss.png');

    // Musique
    this.load.audio('sous-sols', 'assets/sous-sols.mp3');

    // Décor
    this.load.image('decor_fond', 'assets/Sprite-0001-Sheet.png');
}

function create() {
    const { map, sol } = createLevel.call(this);

    // Musique
    this.musicSousSol = this.sound.add('sous-sols', { loop: true, volume: 1 });
    this.musicSousSol.play();
    this.musiqueActuelle = 'sous-sols';

    // --- ANIMATIONS ---
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

    this.anims.create({
        key: 'hurt',
        frames: this.anims.generateFrameNumbers('degats', { start: 0, end: 3 }),
        frameRate: 12,
        repeat: 0
    });

    // --- CRÉATION ---
    createPlayer.call(this);
    createBoss.call(this);

    if (this.player && sol) this.physics.add.collider(this.player, sol);
    if (this.boss && sol) this.physics.add.collider(this.boss, sol);

    // Dégâts du boss → handlePlayerDamage
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

    // Timer attaque / repos
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