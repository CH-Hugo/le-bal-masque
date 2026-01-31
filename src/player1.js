export function createPlayer() {
        this.player = this.add.rectangle(100, 100, 50, 50, 0x00ff00);
        this.player.x = window.innerWidth / 2;
        this.physics.add.existing(this.player);
        this.player.body.setCollideWorldBounds(true);
        this.cursors = this.input.keyboard.createCursorKeys();
}


export function movePlayer() {
    if (!this.player || !this.player.body) return;

    // la marche
    if (this.cursors.left.isDown) {
        this.player.body.setVelocityX(-300);
    } else if (this.cursors.right.isDown) {
        this.player.body.setVelocityX(300);
    } else {
        this.player.body.setVelocityX(0);
    }

    // gerer le sol
    // Si on touche le sol, on remet le compteur à 0
    if (this.player.body.onFloor()) {
        this.jumpCount = 0;
    }

    // double saut
    // JustDown vérifie si on vient de cliquer sur "Haut" à cet instant précis
    const isJumpJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up);

    if (isJumpJustPressed) {
        // 1 saut : on est au sol
        if (this.player.body.onFloor()) {
            this.player.body.setVelocityY(-450);
            this.jumpCount = 1;
        }
        // 2 saut : on est en l'air et on n'a sauté qu'une fois
        else if (this.jumpCount === 1) {
            this.player.body.setVelocityY(-450);
            this.jumpCount = 2;
        }
    }
}