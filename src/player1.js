import { infligerDegatsBoss } from './ennemis/boss.js';

export function createPlayer() {
    this.player = this.physics.add.sprite(10, 10, 'perso');
    this.player.setScale(3.5);
    this.player.body.setCollideWorldBounds(true);
    this.player.body.setSize(19, 30); 
    this.player.body.setOffset(4, 0); 

    this.player.health = 5;
    this.player.isInvulnerable = false;
    this.player.isAttacking = false;
    this.player.isHurt = false;

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    
    this.input.keyboard.on('keydown-SPACE', () => {
        if (!this.player.isAttacking && !this.player.isHurt) {
            lancerAttaque.call(this);
        }
    });

    this.hearts = this.add.group();
    actualisercoeur.call(this);
}

export function movePlayer() {
    // Si isHurt est vrai, on ne touche à rien, on laisse le recul physique se faire
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

    // 1. On crée une zone invisible (hitbox) devant le joueur
    // 60px de large, 30px de haut
    const hitBoxX = this.player.flipX ? this.player.x - 60 : this.player.x + 60;
    const strikeZone = this.add.zone(hitBoxX, this.player.y, 90, 60);
    
    // 2. On ajoute de la physique temporaire à cette zone
    this.physics.add.existing(strikeZone);
    strikeZone.body.setAllowGravity(false);

    // 3. On vérifie si cette zone touche le boss
    if (this.physics.overlap(strikeZone, this.boss)) {
        infligerDegatsBoss.call(this);
    }

    // 4. On détruit la zone et on reset l'état à la fin de l'anim
    this.player.once('animationcomplete-coup_de_poing', () => {
        strikeZone.destroy(); // La zone disparaît
        this.player.isAttacking = false;
        this.player.play('idle', true);
    });
}

export function handlePlayerDamage(player, boss) {
    if (player.isInvulnerable) return;

    player.health -= 1;
    actualisercoeur.call(this);
    if (player.health <= 0) return this.scene.restart();

    player.isHurt = true;
    player.isInvulnerable = true;
    
    // STOP la glissade infinie ici
    const dir = (player.x < boss.x) ? -300 : 300;
    player.setVelocityX(dir);
    player.setVelocityY(-200);
    
    // On applique un gros freinage horizontal
    player.setDragX(1200); 

    player.play('hurt', true);

    this.time.delayedCall(300, () => {
        player.isHurt = false;
        player.setDragX(0); // On retire le freinage pour reprendre le contrôle
    });

    this.time.delayedCall(1000, () => {
        player.isInvulnerable = false;
    });
}

function actualisercoeur() {
    this.hearts.clear(true, true);
    for (let i = 0; i < this.player.health; i++) {
        let heart = this.add.image(100 + (i * 40), 50, 'coeur').setScrollFactor(0);
        heart.setScale(35 / heart.width);
        this.hearts.add(heart);
    }
}