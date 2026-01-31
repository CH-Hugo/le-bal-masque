export class Enemy {
    constructor(scene, x, y, config) {
        this.scene = scene;
        this.x = x;
        this.y = y;

        this.maxHealth = config.maxHealth;
        this.health = this.maxHealth;
        this.damage = config.damage;
        this.speed = config.speed;
        this.width = config.width;
        this.height = config.height;

        this.sprite = this.scene.add.rectangle(x, y, this.width, this.height);
        this.scene.physics.add.existing(this.sprite);
        this.sprite.body.setCollideWorldBounds(true);
    }

    getPosition() {
        x = this.sprite.x;
        y = this.sprite.y;
        return {x, y};
    }
}
