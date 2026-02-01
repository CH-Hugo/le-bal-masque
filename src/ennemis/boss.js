export function createBoss() {
    // 1. Création du sprite
    this.boss = this.physics.add.sprite(300, 200, 'boss');
    
    // 2. TAILLE : On fixe une seule fois à 4 (fini le conflit avec le scale 2 !)
    this.boss.setScale(4); 
    
    // 3. PHYSIQUE : On ajuste la hitbox sur la taille de base (18x11)
    // Phaser l'adaptera automatiquement au scale de 4
    this.boss.body.setSize(18, 11); 
    this.boss.setCollideWorldBounds(true);

    // 4. ANIMATION : On vérifie si elle existe déjà avant de la créer
    if (!this.anims.exists('slime_move')) {
        this.anims.create({
            key: 'slime_move',
            frames: this.anims.generateFrameNumbers('boss', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });
    }

    // 5. LANCEMENT
    this.boss.play('slime_move');

    // 6. VARIABLES D'ÉTAT
    this.bossSpeed = 150;
    this.boss.setVelocityX(this.bossSpeed);

    this.bossJumpCount = 0;
    this.bossDetectionRadius = 300;
    this.bossIsAttacking = true; 
    this.bossIsCurrentlyAttacking = false;
    this.bossHasHit = false;
}

export function moveBoss() {
    if (!this.boss || this.bossIsCurrentlyAttacking) return;

    // Gestion du flip (tourner le regard du slime vers sa direction)
    if (this.boss.body.velocity.x > 0) {
        this.boss.setFlipX(false);
    } else {
        this.boss.setFlipX(true);
    }

    if (this.boss.body.blocked.left || this.boss.body.blocked.right) {
        this.bossSpeed *= -1;
        this.boss.setVelocityX(this.bossSpeed);
    }
}

export function attackCharge() {
    if (!this.player || !this.boss) return;

    console.log("Attaque : CHARGE");

    const direction = this.player.x < this.boss.x ? -1 : 1;
    this.boss.setVelocityX(direction * 500);

    if (this.boss.body.onFloor()) {
        this.boss.setVelocityY(-150);
    }

    this.time.delayedCall(400, () => {
        this.bossIsCurrentlyAttacking = false;
        this.bossHasHit = false;
    });
}

export function attackJump() {
    if (!this.boss) return;

    console.log("Attaque : JUMP");

    this.boss.setVelocityY(-500);

    this.time.delayedCall(500, () => {
        this.time.delayedCall(250, () => {
            this.bossIsCurrentlyAttacking = false;
            this.bossHasHit = false;
        });

        this.cameras.main.shake(150, 0.01);
    });
}

export function attackArea() {
    console.log("Attaque : ZONE");

    this.time.delayedCall(600, () => {
        this.bossIsCurrentlyAttacking = false;
        this.bossHasHit = false;
    });
}

export function chooseBossAttack() {
    if (this.bossIsCurrentlyAttacking) return;

    this.bossIsCurrentlyAttacking = true;

    const attacks = [
        this.attackCharge.bind(this),
        this.attackJump.bind(this),
        this.attackArea.bind(this)
    ];

    Phaser.Math.RND.pick(attacks)();
}

export function detectPlayer() {
    if (!this.player || !this.boss) return;

    const distance = Phaser.Math.Distance.Between(
        this.boss.x, this.boss.y,
        this.player.x, this.player.y
    );

    if (distance < this.bossDetectionRadius && this.bossIsAttacking && !this.bossIsCurrentlyAttacking) {
        this.chooseBossAttack();
    }
}

export function infligerDegatsBoss() {
    if (this.boss.isDead) return;

    // Flash rouge pour le feedback visuel
    this.boss.setTint(0xff0000);
    
    // Le slime est repoussé par l'impact (Knockback)
    const pushDir = this.player.x < this.boss.x ? 1 : -1;
    this.boss.setVelocityX(pushDir * 300);
    this.boss.setVelocityY(-150);

    this.time.delayedCall(200, () => {
        this.boss.clearTint();
        if (!this.bossIsCurrentlyAttacking) {
            this.boss.setVelocityX(this.bossSpeed);
        }
    });
}