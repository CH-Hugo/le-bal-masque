export function createBoss() {
    this.boss = this.physics.add.sprite(300, 200, 'boss');
    this.boss.setCollideWorldBounds(true);
    this.bossSpeed = 150; //rebondit sur les bords, on stocke la vitesse
    this.boss.setVelocityX(this.bossSpeed); //vitesse initiale vers la droite

    this.bossJumpCount = 0;

    this.bossDetectionRadius = 300; //zone de détection, distance en pixels

    this.bossIsAttacking = false;

    //Zone d'attaque
    this.bossAttackZone = this.add.rectangle(0, 0, 80, 80, 0xff0000, 0);
    this.physics.add.existing(this.bossAttackZone);
    this.bossAttackZone.body.setAllowGravity(false);
    this.bossAttackZone.body.enable = false;
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
    if (!this.bossIsAttacking) return;

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
    if (distance < this.bossDetectionRadius && this.bossIsAttacking){
        this.attackBoss();
    }
}

export function updateBossAttackZone() {
    if (!this.boss || !this.bossAttackZone) return;
    const offset = this.boss.flipX ? -40 : 40;

    this.bossAttackZone.x = this.boss.x + offset;
    this.bossAttackZone.y = this.boss.y;
}

export function takeDamage(){
    console.log("Le joueur prend un coup !")
}