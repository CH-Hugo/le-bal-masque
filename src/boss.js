export function createBoss() {
    this.boss = this.physics.add.sprite(300, 200, 'boss');
    this.boss.setCollideWorldBounds(true);
    this.boss.setBounce(1); //rebondit sur les bords
    this.boss.setVelocityX(150); //vitesse initiale vers la droite 
}

export function moovBoss () {
    if (this.boss.body.blocked.left || this.boss.body.blocked.right){
        this.bossSpeed *= -this.bossSpeed;
        this.boss.setVelocityX(this.bossSpeed);
    }
    }