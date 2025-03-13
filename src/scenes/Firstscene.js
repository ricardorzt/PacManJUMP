class Firstscene extends Phaser.Scene {
    constructor() {
        super({ key: "Firstscene" });
    }

    preload() {
        this.load.image('background', '../assets/background.png');
        this.load.image('ground', '../assets/platform.png');
        this.load.image('star', '../assets/strawberry.png');
        this.load.image('ghost', '../assets/ghost.png');
        this.load.image('ghost2', '../assets/ghost4.png');
        this.load.image('ghost3', '../assets/ghost3.png');
        this.load.image('ghost4', '../assets/ghost2.png');
        this.load.spritesheet('pacman', 'assets/pacman_sprite.png', { frameWidth: 50, frameHeight: 49 });
        this.load.bitmapFont('pixel', 'assets/fonts/bitmap/minogram_6x10.png', '../assets/fonts/bitmap/minogram_6x10.xml');
    }

    create() {
        this.add.image(400, 300, 'background');

        // Crear plataformas
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');

        this.physics.world.setBounds(35, 25, 730, 550);

        // Crear jugador
        this.player = this.physics.add.sprite(100, 450, 'pacman');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        // Animaciones del jugador
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('pacman', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'pacman', frame: 2 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('pacman', { start: 3, end: 4 }),
            frameRate: 10,
            repeat: -1
        });

        // Controles
        this.cursors = this.input.keyboard.createCursorKeys();

        // Crear estrellas
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 9,
            setXY: { x: 50, y: 0, stepX: 75 }
        });

        this.stars.children.iterate(child => {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        // Bombas
        this.bombs = this.physics.add.group();
        this.cantBombs = 0;

        // Puntuación
        this.score = 0;
        this.gameOver = false;
        this.scoreText = this.add.bitmapText(45, 45, 'pixel', "score: 0", 20);

        // Colisiones
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.collider(this.bombs, this.platforms);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
    }

    update() {
        if (this.gameOver) return;

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-330);
        }
    }

    collectStar(player, star) {
        star.disableBody(true, true);

        // Actualizar puntuación
        this.score += 10;
        this.scoreText.setText("score: " + this.score);

        if (this.stars.countActive(true) === 0) {
            // Restaurar estrellas
            this.stars.children.iterate(child => {
                child.enableBody(true, child.x, 0, true, true);
            });

            var x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
            var bombKey = ['ghost', 'ghost2', 'ghost3', 'ghost4'][this.cantBombs] || 'ghost4';

            var bomb = this.bombs.create(x, 16, bombKey);
            this.cantBombs++;

            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
            bomb.allowGravity = false;
        }
    }

    hitBomb(player, bomb) {
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play('turn');
        this.gameOver = true;
    }
}

export default Firstscene;