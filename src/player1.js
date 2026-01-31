export function createPlayer() {
        this.player = this.add.rectangle(100, 100, 50, 50, 0x00ff00);
        this.player.x = window.innerWidth / 2;
        this.physics.add.existing(this.player);
        this.player.body.setCollideWorldBounds(true);
        this.cursors = this.input.keyboard.createCursorKeys();
}


export function movePlayer() {
    if (!this.player || !this.player.body) return;

    if (this.cursors.left.isDown) {
        this.player.body.setVelocityX(-300);
    } else if (this.cursors.right.isDown) {
        this.player.body.setVelocityX(300);
    } else {
        this.player.body.setVelocityX(0); 
    }

    if (this.cursors.up.isDown && this.player.body.blocked.down) {
        this.player.body.setVelocityY(-450);
    }
}