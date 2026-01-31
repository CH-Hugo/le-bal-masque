export function createPlayer() {
        this.player = this.add.rectangle(100, 100, 50, 50, 0x00ff00);
        this.player.y = window.innerHeight / 2;
        this.player.x = window.innerWidth / 2;
        this.physics.add.existing(this.player);
        this.player.body.setCollideWorldBounds(true);
        this.cursors = this.input.keyboard.createCursorKeys();
}


export function movePlayer() {
    if (!this.player || !this.player.body) return;

    switch (this.cursors) {
        case (this.cursors.left.isDown): this.player.body.setVelocityX(-300); return;
        case (this.cursors.right.isDown): this.player.body.setVelocityX(300); return;
        case (this.cursors.up.isDown): this.player.body.setVelocityY(200); return;
        default: this.player.body.setVelocity(0);
    }
}
