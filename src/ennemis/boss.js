export function createBoss() {
    this.boss = this.physics.add.sprite(300, 200, 'boss');
    this.boss.setCollideWorldBounds(true);

    this.bossSpeed = 150;
    this.boss.setVelocityX(this.bossSpeed);

    this.bossJumpCount = 0;

    this.bossDetectionRadius = 300; //zone de détection, distance en pixels
}

export function moveBoss () {
    if (this.boss.body.blocked.left || this.boss.body.blocked.right){
        this.bossSpeed *= -1;
        this.boss.setVelocityX(this.bossSpeed);
    }
}

export function jumpBoss(){
    if (this.boss.body.onFloor()){
        this.bossJumpCount = 0;
    }
    if (this.bossJumpCount < 2){
        this.boss.setVelocityY(-400);
        this.bossJumpCount++;
    }
}

export function attackBoss(){
    if (!this.player) return; //vérifie que le joueur existe

    const direction = this.player.x < this.boss.x ? -1 : 1; //calcule de la direction vers le joueur
    
    this.boss.setVelocityX(direction*500); //donner une grosse vitesse pour simuler une attaque
    
    if (this.boss.body.onFloor()) {
        this.boss.setVelocityY(-150);
    }

}

export function detectPlayer(){
    if (!this.player || !this.boss) return;

    const distance = Phaser.Math.Distance.Between(
        this.boss.x, this.boss.y,
        this.player.x, this.player.y
    );
    if (distance < this.bossDetectionRadius){
        this.attackBoss();
    }
}