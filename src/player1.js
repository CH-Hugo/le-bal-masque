export function createPlayer() {
    // --- TES VISUELS ---
    this.player = this.physics.add.sprite(10, 10, 'perso');
    this.player.setScale(2);
    this.player.x = window.innerWidth / 2;
    this.player.body.setCollideWorldBounds(true);

    // Tes réglages de hitbox précis
    this.player.body.setSize(16, 30); 
    this.player.body.setOffset(4, 0); 

    this.player.play('idle');

    // --- SES FONCTIONNALITÉS (Variables de dégâts) ---
    this.player.isInvulnerable = false;
    this.player.health = 5;
    this.player.maxHealth = 5;

    // --- TES CONTRÔLES ---
    this.cursors = this.input.keyboard.createCursorKeys();
    this.player.isDashing = false;
    this.canDash = true;
    this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.sprintSpeed = 450;
    this.walkSpeed = 300;
    
    // Interface
    this.hearts = this.add.group();
    actualisercoeur.call(this);
}

// --- SA FONCTION DE DÉGÂTS (Fusionnée) ---
export function handlePlayerDamage(player, boss) {
    // On ne prend des dégâts que si le boss attaque et qu'on n'est pas déjà touché/invulnérable
    if (!this.bossIsAttacking || this.bossHasHit || player.isInvulnerable) return;

    this.bossHasHit = true; // Bloque les dégâts multiples en une attaque
    player.health -= 1;
    actualisercoeur.call(this);

    if (player.health <= 0) {
        this.scene.restart();
        return;
    }

    // Effet d'invulnérabilité (clignotement alpha)
    player.isInvulnerable = true;
    player.setAlpha(0.5);

    this.time.addEvent({
        delay: 1000,
        callback: () => {
            player.isInvulnerable = false;
            player.setAlpha(1);
        },
        callbackScope: this
    });
}

export function movePlayer() {
    if (!this.player || !this.player.body || this.player.isDashing) return;

    let currentSpeed = this.keyD.isDown ? this.sprintSpeed : this.walkSpeed;

    // --- TES ANIMATIONS ET MOUVEMENTS ---
    if (this.cursors.left.isDown) {
        this.player.body.setVelocityX(-currentSpeed);
        this.player.setFlipX(true);
        this.player.play('marche', true);
        this.player.body.setOffset(7, 2); 
    } 
    else if (this.cursors.right.isDown) {
        this.player.body.setVelocityX(currentSpeed);
        this.player.setFlipX(false);
        this.player.play('marche', true);
        this.player.body.setOffset(7, 2);
    } 
    else {
        this.player.body.setVelocityX(0);
        this.player.play('idle', true);
        this.player.body.setOffset(4, 0); 
    }

    // --- TA LOGIQUE DE SAUT ---
    if (this.cursors.down.isDown && !this.player.body.onFloor()) {
        this.player.body.setVelocityY(400);
    }
    if (this.player.body.onFloor()) {
        this.jumpCount = 0;
    }
    if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
        if (this.player.body.onFloor()) {
            this.player.body.setVelocityY(-450);
            this.jumpCount = 1;
        } else if (this.jumpCount === 1) {
            this.player.body.setVelocityY(-450);
            this.jumpCount = 2;
        }
    }

    // --- TA LOGIQUE DE DASH (Améliorée avec la direction) ---
    if (Phaser.Input.Keyboard.JustDown(this.keyQ) && this.canDash) {
        this.player.isDashing = true;
        this.canDash = false;
        const dashDirection = this.player.flipX ? -1000 : 1000;
        this.player.body.setVelocityX(dashDirection);

        this.time.addEvent({
            delay: 200,
            callback: () => {
                this.player.isDashing = false;
                if (!this.cursors.left.isDown && !this.cursors.right.isDown) {
                    this.player.body.setVelocityX(0);
                }
            },
            callbackScope: this
        });
        this.time.addEvent({ delay: 2500, callback: () => this.canDash = true });
    }
}

function actualisercoeur() {
    this.hearts.clear(true, true);
    const marginLeft = 150;
    const marginTop = 90;
    const spacing = 40;
    const targetSize = 35;

    for (let i = 0; i < this.player.health; i++) {
        let posX = marginLeft + (i * spacing);
        let heart = this.add.image(posX, marginTop, 'coeur');
        heart.setScrollFactor(0);
        heart.setScale(targetSize / heart.width);
        this.hearts.add(heart);
    }
}