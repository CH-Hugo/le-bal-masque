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

    // 1. On augmente la largeur de la hitbox (on passe de 19 à 45 pour avoir de l'allonge)
    this.player.body.setSize(45, 30); 

    // 2. Ajustement précis du décalage (Offset) selon la direction
    if (this.player.flipX) {
        // Regarde à GAUCHE : on décale la hitbox vers la gauche du sprite
        // On met une valeur négative ou réduite pour pousser la boîte vers l'arrière du point d'origine
        this.player.body.setOffset(-15, 0); 
    } else {
        // Regarde à DROITE : on décale la hitbox vers la droite
        // On met une valeur positive pour pousser la boîte vers l'avant
        this.player.body.setOffset(10, 0); 
    }

    this.player.play('coup_de_poing', true);

    // 3. Calcul de la distance pour les dégâts
    const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.boss.x, this.boss.y);
    
    // Vérification de la direction pour ne pas taper dans le dos
    const versLaGauche = this.player.flipX && this.boss.x < this.player.x;
    const versLaDroite = !this.player.flipX && this.boss.x > this.player.x;

    if (distance < 85 && (versLaGauche || versLaDroite)) {
        infligerDegatsBoss.call(this);
    }

    // 4. Retour à la normale
    this.player.once('animationcomplete-coup_de_poing', () => {
        this.player.isAttacking = false;
        
        // On remet la hitbox de base (19x30) et son offset d'origine (4)
        this.player.body.setSize(19, 30);
        this.player.body.setOffset(4, 0);
        
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