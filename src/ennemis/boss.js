export function createBoss() {
    this.boss = this.physics.add.sprite(300, 200, 'boss');
    this.boss.setCollideWorldBounds(true);
    this.bossSpeed = 150;
    this.boss.setVelocityX(this.bossSpeed);

    this.bossJumpCount = 0;
    this.bossDetectionRadius = 300;

    this.bossIsAttacking = false;
    this.bossIsCurrentlyAttacking = false;
    this.bossHasHit = false; // IMPORTANT pour handlePlayerDamage
}

export function moveBoss() {
    if (!this.boss || this.bossIsCurrentlyAttacking) return;

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