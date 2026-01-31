export function createplayer() {
        this.player = this.add.rectangle(100, 100, 50, 50, 0x00ff00);
        this.player.y = window.innerHeight / 2;
        this.player.x = window.innerWidth / 2;
        this.physics.add.existing(this.player);
        this.player.body.setCollideWorldBounds(true);
        this.cursors = this.input.keyboard.createCursorKeys();
}


export function mooveplayer() {
    if (!this.player || !this.player.body) return;

    this.player.body.setVelocityX(0);

    if (this.cursors.left.isDown) {
        this.player.body.setVelocityX(-300);
    } else if (this.cursors.right.isDown) {
        this.player.body.setVelocityX(300);
    }
}