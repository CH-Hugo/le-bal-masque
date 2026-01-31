export function mooveplayer() {
    if (!this.player || !this.player.body) return;

    this.player.body.setVelocity(0);

    if (this.cursors.left.isDown) {
        this.player.body.setVelocityX(-300);
    } else if (this.cursors.right.isDown) {
        this.player.body.setVelocityX(300);
    }
}