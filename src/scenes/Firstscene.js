class Firstscene extends Phaser.Scene {
    constructor() {
        super({ key: "Firstscene" });
    }

    preload() {
        this.text = this.add.text(200,150, 'Loading files ...', { font: '16px Courier', fill: '#ffffff' });

        this.load.image('background', '../assets/background.png');
        this.load.image('ground', '../assets/platform.png');
        this.load.image('star', '../assets/strawberry.png');
        this.load.image('ghost', '../assets/ghost.png');
        this.load.image('ghost2', '../assets/ghost4.png');
        this.load.image('ghost3', '../assets/ghost3.png');
        this.load.image('ghost4', '../assets/ghost2.png');
        this.load.image('orange', '../assets/orange.png');
        this.load.image('cherry', '../assets/cherry.png');
        //this.load.spritesheet('death', '../assets/pacman-death.png', { frameWidth: 48, frameHeight: 48 });
        //this.load.spritesheet('pacman', 'assets/pacman_sprite.png', { frameWidth: 50, frameHeight: 49 });
        this.load.spritesheet('pacman', 'assets/pacman-full.png', { frameWidth: 48, frameHeight: 48 });
        this.load.bitmapFont('pixel', 'assets/fonts/bitmap/minogram_6x10.png', '../assets/fonts/bitmap/minogram_6x10.xml');

        //audio
        this.load.audio('death', '../assets/audio/death_0.wav');
        this.load.audio('eat', '../assets/audio/eat_fruit.wav');
        this.load.audio('start', '../assets/audio/start.wav');
        this.load.audio('loop', '../assets/audio/siren0.wav');
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
        this.lives=3;

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
        this.anims.create({
            key: 'death',
            frames: this.anims.generateFrameNumbers('pacman', { start: 5, end: 16 }),
            frameRate: 6,
            repeat: -0
        });

        // Controles
        this.cursors = this.input.keyboard.createCursorKeys();

        //Sonidos
        this.loopSound=this.sound.add("loop");
        this.loopSound.volume = 0.3;
        this.loopSound.loop = true;
        

        this.startSound=this.sound.add('start');
        this.eatSound=this.sound.add('eat');
        this.deathSound=this.sound.add('death');

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

        //Estrella especial
        this.special=this.physics.add.group();
        this.cantSpecial = 0;
        this.isSpecial=false;
        this.specialTime=0;
        this.specialMsg='';

        // Puntuación
        this.score = 0;
        this.gameOver = false;
        this.scoreText = this.add.bitmapText(45, 45, 'pixel', "score: 0", 20);

        // Colisiones
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.collider(this.bombs, this.platforms);
        this.physics.add.collider(this.special, this.platforms);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
        this.physics.add.collider(this.player, this.special, this.collectSpecial, null, this);

        

        this.startSound.play();
        this.loopSound.play();
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

        this.eatSound.play();

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

        if(((Math.floor(Math.random()*250))>200 && this.cantSpecial==0) && this.cantBombs>1){
            var pos = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
            var specialItem= this.special.create(pos,16,'orange');
            this.cantSpecial++;
            this.isSpecial=true;

            specialItem.setBounce(1);
            specialItem.setCollideWorldBounds(true);
            specialItem.setVelocity(Phaser.Math.Between(-200, 200), 20);
            specialItem.allowGravity = false;

            var timer= this.time.addEvent({
                delay: 3000,
                callback: ()=>{
                    specialItem.disableBody(true, true);
                    this.isSpecial=false;
                }
            });

            //var elapsed = timer.getElapsedSeconds();
            //this.specialTime=
        }

        if(((Math.floor(Math.random()*450))>430 && this.cantSpecial==1)&& this.cantBombs>=3){
            var pos = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
            var specialItem= this.special.create(pos,16,'cherry');
            this.cantSpecial++;

            specialItem.setBounce(1);
            specialItem.setCollideWorldBounds(true);
            specialItem.setVelocity(Phaser.Math.Between(-200, 200), 20);
            specialItem.allowGravity = false;


        }
    }

    collectSpecial(player, special){
            special.disableBody(true, true);
            this.eatSound.play();
            this.score+=30;
    }

    checkwin(score){
        /* if (this.score>=5000){
            if(this)
        } */

    }

    hitBomb(player, bomb) {
        this.physics.pause();
        //player.setTint(0xff0000);
        player.anims.play('death');
        this.loopSound.pause();
        this.deathSound.play();
        this.gameOver = true;
    }
}

export default Firstscene;