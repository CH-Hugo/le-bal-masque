export function createPlayer() {
    this.player = this.add.rectangle(100, 100, 50, 50, 0x00ff00);
    this.player.x = window.innerWidth / 2;
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.player.isDashing = false;
    this.canDash = true;
    this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.sprintSpeed = 450;
    this.walkSpeed = 300;
    this.player.health = 5;
    this.player.maxHealth = 5;
    this.hearts = this.add.group();
    actualisercoeur.call(this);
}

export function movePlayer() {
    if (!this.player || !this.player.body) return;

    if (this.player.isDashing) {
        return;
    }

    let currentSpeed = this.walkSpeed;

    if (this.keyD.isDown) {
        currentSpeed = this.sprintSpeed;
    }

    if (this.cursors.left.isDown) {
        this.player.body.setVelocityX(-currentSpeed);
    } else if (this.cursors.right.isDown) {
        this.player.body.setVelocityX(currentSpeed);
    } else {
        this.player.body.setVelocityX(0);
    }


    if (this.cursors.down.isDown && !this.player.body.onFloor()) {
        this.player.body.setVelocityY(400);
    }

    if (this.player.body.onFloor()) {
        this.jumpCount = 0;
    }

    const isJumpJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up);
    if (isJumpJustPressed) {
        if (this.player.body.onFloor()) {
            this.player.body.setVelocityY(-450);
            this.jumpCount = 1;
        } else if (this.jumpCount === 1) {
            this.player.body.setVelocityY(-450);
            this.jumpCount = 2;
        }
    }

    if (Phaser.Input.Keyboard.JustDown(this.keyQ) && this.canDash) {
        this.player.isDashing = true;
        this.canDash = false;
        this.player.body.setVelocityX(-1000);

        this.time.addEvent({
            delay: 200,
            callback: () => {
                this.player.isDashing = false;
                this.player.body.setVelocityX(0);
            },
            callbackScope: this
        });

        this.time.addEvent({
            delay: 2500,
            callback: () => {
                this.canDash = true;
            },
            callbackScope: this
        });
    }
}
function actualisercoeur() {
    this.hearts.clear(true, true);    
    const marginLeft = 150; 
    const marginTop = 90;  
    const spacing = 40; 
    const targetSize = 35;

    for (let i = 0; i < this.player.health; i++) {
        let posX = marginLeft + (i * spacing);
        let posY = marginTop; 
        
        let heart = this.add.image(posX, posY, 'coeur');

        heart.setScrollFactor(0);

        let scale = targetSize / heart.width;
        heart.setScale(scale);

        this.hearts.add(heart);
    }
}