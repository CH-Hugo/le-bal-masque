export function createBoss() {
    // Sprite du boss
    this.boss = this.physics.add.sprite(300, 200, 'boss');
    this.boss.setScale(4);

    // Hitbox d’origine (pas agrandie)
    this.boss.body.setSize(18, 11);
    this.boss.body.setOffset(0, 0);

    this.boss.setCollideWorldBounds(true);

    // Animation du slime
    if (!this.anims.exists('slime_move')) {
        this.anims.create({
            key: 'slime_move',
            frames: this.anims.generateFrameNumbers('boss', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });
    }

    this.boss.play('slime_move');

    // Mouvement comme avant
    this.bossSpeed = 150;
    this.boss.setVelocityX(this.bossSpeed);

    // Variables d’état
    this.bossJumpCount = 0;
    this.bossDetectionRadius = 300;
    this.bossIsAttacking = true;
    this.bossIsCurrentlyAttacking = false;
    this.bossHasHit = false;

    // Vie du boss
    this.boss.health = 3;
    this.boss.isDead = false;
}

export function moveBoss() {
    if (!this.boss || this.bossIsCurrentlyAttacking) return;

    // Flip selon direction
    if (this.boss.body.velocity.x > 0) {
        this.boss.setFlipX(false);
    } else {
        this.boss.setFlipX(true);
    }

    // Rebond comme avant
    if (this.boss.body.blocked.left || this.boss.body.blocked.right) {
        this.bossSpeed *= -1;
        this.boss.setVelocityX(this.bossSpeed);
    }
}

export function attackCharge() {
    if (!this.player || !this.boss) return;

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

    // Perte de PV
    this.boss.health--;

    // Mise à jour des cœurs du boss
    if (this.actualiserCoeursBoss) {
        this.actualiserCoeursBoss();
    }

    console.log("Boss touché ! PV restants :", this.boss.health);

    // Flash rouge
    this.boss.setTint(0xff0000);
    this.time.delayedCall(150, () => this.boss.clearTint());

    // Knockback léger
    const pushDir = this.player.flipX ? 1 : -1;
    this.boss.setVelocityX(pushDir * 200);
    this.boss.setVelocityY(-100);

    // Mort du boss
    if (this.boss.health <= 0) {
        this.boss.isDead = true;

        // Effet de mort
        this.boss.setTint(0x000000);
        this.boss.setVelocity(0, 0);

        // Fade-out propre
        this.tweens.add({
            targets: this.boss,
            alpha: 0,
            duration: 300,
            onComplete: () => {
                this.boss.destroy();
                console.log("Boss vaincu !");
            }
        });

        // Supprimer les cœurs du boss
        if (this.bossHearts) {
            this.bossHearts.clear(true, true);
        }
    }
}