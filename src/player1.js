export function createPlayer() {
    this.player = this.add.rectangle(100, 100, 50, 50, 0x00ff00);
    this.player.x = window.innerWidth / 2;
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.player.isDashing = false;
    this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
}

export function movePlayer() {
    if (!this.player || !this.player.body) return;

    if (this.player.isDashing) {
        return;
    }

    if (this.cursors.left.isDown) {
        this.player.body.setVelocityX(-300);
    } else if (this.cursors.right.isDown) {
        this.player.body.setVelocityX(300);
    } else {
        this.player.body.setVelocityX(0);
    }

    if (this.player.body.onFloor()) {
        this.jumpCount = 0;
    }

    const isJumpJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up);

    if (isJumpJustPressed) {
        if (this.player.body.onFloor()) {
            this.player.body.setVelocityY(-450);
            this.jumpCount = 1;
        }
        else if (this.jumpCount === 1) {
            this.player.body.setVelocityY(-450);
            this.jumpCount = 2;
        }
    }

    if (Phaser.Input.Keyboard.JustDown(this.keyQ)) {
        this.player.isDashing = true;

        this.player.body.setVelocityX(-1000);

        this.time.addEvent({
            delay: 200,
            callback: () => {
                this.player.isDashing = false;
                this.player.body.setVelocityX(0);
            },
            callbackScope: this
        });
    }
}