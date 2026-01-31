export function createBoss() {
    this.boss = this.physics.add.sprite(300, 200, 'boss');
    this.boss.setCollideWorldBounds(true);

    this.bossSpeed = 150;
    this.boss.setVelocityX(this.bossSpeed);

    this.bossJumpCount = 0;

    this.time.addEvent({
        delay:1500,
        callback: () => {
            this.jumpBoss();
        },
        loop: true
    });
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