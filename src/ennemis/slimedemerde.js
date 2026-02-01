export function createSLime(x, y, minX, maxX){
    this.slime = this.physics.add.sprite(x, y, 'slime');
    this.slime.setCollideWorldBounds(true);

    this.slime.minX = minX;
    this.slime.maxX = maxX;
    this.slime.speed = 40;

    this.slime.health = 3;

    this.slime.setVelocityX(this.slime.speed);
}

export function moveSlime() {
    if (!this.slime) return;

    if (this.slime.x <= this.slime.minX) {
        this.slime.setVelocityX(this.slime.speed);
        this.slime.setFlipX(false);
    }

    if (this.slime.x >= this.slime.maxX) {
        this.slime.setVelocityX(-this.slime.speed);
        this.slime.setFlipX(true);
    }
}

export function damageSlime(player, slime){
    slime.health--;

    console.log("Slime touché ! PV restants :", slime.health);

    if(slime.health =< 0) {
        slime.destroy();
    }
}