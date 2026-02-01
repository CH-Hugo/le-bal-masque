import { infligerDegatsBoss } from './ennemis/slimedemerde.js';

export function createPlayer() {
    this.player = this.physics.add.sprite(10, 10, 'perso');
    this.player.setScale(3.5);
    this.player.body.setCollideWorldBounds(true);
    this.player.body.setSize(19, 30);
    this.player.body.setOffset(4, 0);

<<<<<<< HEAD
=======
    // Tes réglages de hitbox précis
    this.player.body.setSize(16, 30);
    this.player.body.setOffset(4, 0);

    this.player.play('idle');

    // --- SES FONCTIONNALITÉS (Variables de dégâts) ---
    this.player.isInvulnerable = false;
>>>>>>> 31bcc16 (temporaire)
    this.player.health = 5;
    this.player.isInvulnerable = false;
    this.player.isAttacking = false;
    this.player.isHurt = false;

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
<<<<<<< HEAD

    this.input.keyboard.on('keydown-SPACE', () => {
        if (!this.player.isAttacking && !this.player.isHurt) {
            lancerAttaque.call(this);
        }
    });

=======
    this.sprintSpeed = 450;
    this.walkSpeed = 300;

    // Interface
>>>>>>> 31bcc16 (temporaire)
    this.hearts = this.add.group();
    actualisercoeur.call(this);
}

<<<<<<< HEAD
export function movePlayer() {
    if (!this.player.body || this.player.isHurt || this.player.isAttacking) return;

    let speed = this.keyD.isDown ? 450 : 300;

    if (this.cursors.left.isDown) {
        this.player.setVelocityX(-speed);
        this.player.setFlipX(true);
        this.player.play('marche', true);
    } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(speed);
        this.player.setFlipX(false);
        this.player.play('marche', true);
    } else {
        this.player.setVelocityX(0);
        this.player.play('idle', true);
=======
// --- SA FONCTION DE DÉGÂTS (Fusionnée et corrigée) ---
export function handlePlayerDamage(player, boss) {
    // On ne prend des dégâts que si le boss attaque et qu'on n'est pas déjà touché/invulnérable
    if (player.health <= 0 || player.isInvulnerable) return;

    // Vérification de l'attaque des deux boss possibles
    const isAttacking = this.bossIsAttacking || this.bossFinalIsAttacking;
    const alreadyHit = this.bossHasHit || this.bossFinalHasHit;

    if (!isAttacking || alreadyHit) return;

    // Bloque les dégâts multiples en une attaque
    if (this.bossIsAttacking) this.bossHasHit = true;
    if (this.bossFinalIsAttacking) this.bossFinalHasHit = true;

    player.health -= 1;
    actualisercoeur.call(this);

    // CHANGEMENT ICI : On appelle gameOver au lieu de restart
    if (player.health <= 0) {
        gameOver.call(this);
        return;
>>>>>>> 31bcc16 (temporaire)
    }

    if (Phaser.Input.Keyboard.JustDown(this.cursors.up) && (this.player.body.onFloor() || this.jumpCount < 2)) {
        this.player.setVelocityY(-450);
        this.jumpCount = (this.player.body.onFloor()) ? 1 : 2;
    }
}

function lancerAttaque() {
    this.player.isAttacking = true;
    this.player.setVelocityX(0);
    this.player.play('coup_de_poing', true);
    this.player.once('animationcomplete', () => {
    this.player.isAttacking = false;
    });
    this.player.once('animationcomplete', () => {
    this.player.isAttacking = false;
    });


    // Hitbox rapprochée et fiable
    const hitBoxX = this.player.flipX ? this.player.x - 40 : this.player.x + 40;
    const strikeZone = this.add.zone(hitBoxX, this.player.y, 70, 50);

    this.physics.add.existing(strikeZone);
    strikeZone.body.setAllowGravity(false);

    if (this.physics.overlap(strikeZone, this.boss)) {
        infligerDegatsBoss.call(this);
    }

    this.player.once('animationcomplete-coup_de_poing', () => {
        strikeZone.destroy();
        this.player.isAttacking = false;
        this.player.play('idle', true);
    });
}

<<<<<<< HEAD
export function handlePlayerDamage(player, boss) {
    if (player.isInvulnerable) return;
=======
export function movePlayer() {
    // On bloque le mouvement si le joueur est mort
    if (!this.player || !this.player.body || this.player.isDashing || this.player.health <= 0) return;
>>>>>>> 31bcc16 (temporaire)

    player.health -= 1;
    actualisercoeur.call(this);
    if (player.health <= 0) return this.scene.restart();

<<<<<<< HEAD
    player.isHurt = true;
    player.isInvulnerable = true;
=======
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
>>>>>>> 31bcc16 (temporaire)

    const dir = (player.x < boss.x) ? -300 : 300;
    player.setVelocityX(dir);
    player.setVelocityY(-200);

    player.setDragX(1200);
    player.play('hurt', true);

    this.time.delayedCall(300, () => {
        player.isHurt = false;
        player.setDragX(0);
    });

    this.time.delayedCall(1000, () => {
        player.isInvulnerable = false;
    });
}

export function actualisercoeur() {
    this.hearts.clear(true, true);
    for (let i = 0; i < this.player.health; i++) {
        let heart = this.add.image(100 + (i * 40), 50, 'coeur').setScrollFactor(0);
        heart.setScale(35 / heart.width);
        this.hearts.add(heart);
    }
}

// --- TA FONCTION GAME OVER CORRIGÉE ---
export function gameOver() {
    // On stoppe la physique et on change la couleur du joueur
    this.physics.pause();
    this.player.setTint(0xff0000);

    const screenCenterY = this.cameras.main.worldView.centerY;
    const screenCenterX = this.cameras.main.worldView.centerX;

    // message GAME OVER
    const gameOverText = this.add.text(screenCenterX, screenCenterY - 50, 'GAME OVER', {
        fontSize: '64px',
        fill: '#ff0000',
        fontStyle: 'bold'
    }).setOrigin(0.5).setScrollFactor(0);

    // bouton recommencer
    const restartButton = this.add.text(screenCenterX, screenCenterY + 50, 'Recommencer', {
        fontSize: '32px',
        fill: '#ffffff',
        backgroundColor: '#000000',
        padding: { x: 20, y: 10 }
    })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setInteractive({ useHandCursor: true });

    // Actualiser la page
    restartButton.on('pointerdown', () => {
        window.location.reload();
    });
}