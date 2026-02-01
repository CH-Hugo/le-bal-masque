import { movePlayer, createPlayer, handlePlayerDamage } from './player1.js';
import { 
    createBoss, 
    moveBoss,
    detectPlayer, 
    attackCharge,
    attackJump,
    attackArea,
    chooseBossAttack,
    infligerDegatsBoss
} from './ennemis/slimedemerde.js';
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
        arcade: { gravity: { y: 600 }, debug: true }
    },
    render: { pixelArt: true },
    scene: { preload, create, update }
};

new Phaser.Game(config);

function preload() {
    this.load.tilemapTiledJSON('maMap', 'assets/map.json'); 
    
    this.load.image('mesTuiles', 'assets/Sprite-0001-Sheet.png'); 
    this.load.image('texturePlateforme', 'assets/pixels.jpg');
    this.load.image('coeur', 'assets/coeur.png');

    this.load.spritesheet('perso', 'assets/perso.png', { frameWidth: 24, frameHeight: 30 });
    this.load.spritesheet('perso_marche', 'assets/marche.png', { frameWidth: 30, frameHeight: 32 });

    this.load.spritesheet('degats', 'assets/degats.png', { frameWidth: 46, frameHeight: 32 });
    this.load.spritesheet('anim_attaque', 'assets/attaque.png', { frameWidth: 38, frameHeight: 30 });

    this.load.spritesheet('boss', 'assets/slime.png', { frameWidth: 18, frameHeight: 11 });

    this.load.audio('sous-sols', 'assets/sous-sols.mp3');

    this.load.image('decor_fond', 'assets/Sprite-0001-Sheet.png');
}

function create() {
    const { map, sol } = createLevel.call(this);

    this.musicSousSol = this.sound.add('sous-sols', { loop: true, volume: 1 });
    this.musicSousSol.play();

    // Animations du joueur
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

    this.anims.create({
        key: 'coup_de_poing',
        frames: this.anims.generateFrameNumbers('anim_attaque', { start: 0, end: 7 }),
        frameRate: 16,
        repeat: 0
    });

    // Création joueur + boss
    createPlayer.call(this);
    createBoss.call(this);

    if (this.player && sol) this.physics.add.collider(this.player, sol);
    if (this.boss && sol) this.physics.add.collider(this.boss, sol);

    // Dégâts du boss → joueur
    this.physics.add.overlap(
        this.player,
        this.boss,
        handlePlayerDamage,
        null,
        this
    );

    // Cœurs du boss (à droite)
    this.bossHearts = this.add.group();

    this.actualiserCoeursBoss = () => {
        this.bossHearts.clear(true, true);

        if (!this.boss || this.boss.isDead) return;

        for (let i = 0; i < this.boss.health; i++) {
            let heart = this.add.image(
                window.innerWidth - 100 - (i * 40),
                50,
                'coeur'
            ).setScrollFactor(0);

            heart.setScale(35 / heart.width);
            this.bossHearts.add(heart);
        }
    };

    this.actualiserCoeursBoss();

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

            if (!this.bossIsAttacking) {
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