export function createBoss() {
    this.boss = this.physics.add.sprite(300, 200, 'boss');
    this.boss.setCollideWorldBounds(true);
    this.bossSpeed = 150; //rebondit sur les bords, on stocke la vitesse
    this.boss.setVelocityX(this.bossSpeed); //vitesse initiale vers la droite 
}

export function moveBoss () {
    if (this.boss.body.blocked.left || this.boss.body.blocked.right){
        this.bossSpeed *= -1;
        this.boss.setVelocityX(this.bossSpeed);
    }
}