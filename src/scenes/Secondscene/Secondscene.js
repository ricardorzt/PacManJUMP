import Track from './Track.js';
import Player from './Player.js';

export default class Secondscene extends Phaser.Scene {
    constructor() {
        super('Secondscene');
        console.log("Secondscene.js ha sido cargado correctamente");

        this.player;
        this.tracks;

        this.score = 0;
        this.highscore = 0;
        this.infoPanel;

        this.scoreTimer;
        this.scoreText;
        this.highscoreText;
    }

    preload() {
        // Cargar fondo
       // this.load.image('background', '../assets/background.png');

        this.load.spritesheet('pacman', '../assets/pacman_sprite.png', { frameWidth: 50, frameHeight: 49 });

        // Cargar fantasmas de diferentes colores
        this.load.image('ghost-red', '../assets/ghost.png');
        this.load.image('ghost-blue', '../assets/ghost2.png');
        this.load.image('ghost-green', '../assets/ghost3.png');
        this.load.image('ghost-yellow', '../assets/ghost4.png');

        // Cargar proyectiles (pellets)
        //this.load.image('pellet', '../assets/pellet.png');
        //this.load.image('enemy-pellet', '../assets/enemy_pellet.png');

        // Cargar otros elementos del HUD
        //this.load.image('overlay', 'assets/overlay.png');
        //this.load.image('gameover', 'assets/gameover.png');
    }

    create() {
        this.score = 0;
        this.highscore = this.registry.get('highscore') || 0; // ✅ Asegura que siempre tenga un valor

        // Fondo
        //this.add.image(512, 384, 'background');

        // Crear las pistas de movimiento con los fantasmas incluidos en Track.js
        this.tracks = [
            new Track(this, 0, 196),
            new Track(this, 1, 376),
            new Track(this, 2, 536),
            new Track(this, 3, 700)
        ];

        // Crear el jugador (Pac-Man)
        this.player = new Player(this, this.tracks[0]);

        // UI
        //this.add.image(0, 0, 'overlay').setOrigin(0);
        //this.add.image(16, 0, 'sprites', 'panel-score').setOrigin(0);
        //this.add.image(1024 - 16, 0, 'sprites', 'panel-best').setOrigin(1, 0);

        //this.infoPanel = this.add.image(512, 384, 'sprites', 'controls');
        this.scoreText = this.add.text(140, 2, this.score, { fontFamily: 'Arial', fontSize: 32, color: '#ffffff' });
        this.highscoreText = this.add.text(820, 2, this.highscore, { fontFamily: 'Arial', fontSize: 32, color: '#ffffff' });

        // Iniciar juego al presionar SPACE, UP o DOWN
        this.input.keyboard.once('keydown-SPACE', this.start, this);
        this.input.keyboard.once('keydown-UP', this.start, this);
        this.input.keyboard.once('keydown-DOWN', this.start, this);
    }

    start() {
        this.input.keyboard.removeAllListeners();

        // Animación para ocultar el panel de controles
        this.tweens.add({
            targets: this.infoPanel,
            y: 700,
            alpha: 0,
            duration: 500,
            ease: 'Power2'
        });

        // Iniciar el jugador
        this.player.start();

        // Iniciar las pistas con tiempos diferentes
        this.tracks[0].start(4000, 8000);
        this.tracks[1].start(500, 1000);
        this.tracks[2].start(5000, 9000);
        this.tracks[3].start(6000, 10000);

        // Contador de puntos
        this.scoreTimer = this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.score++;
                this.scoreText.setText(this.score);
            },
            callbackScope: this,
            repeat: -1
        });
    }

    gameOver() {
        //this.infoPanel.setTexture('gameover');

        this.tweens.add({
            targets: this.infoPanel,
            y: 384,
            alpha: 1,
            duration: 500,
            ease: 'Power2'
        });

        // Detener todas las pistas (y por lo tanto, los fantasmas)
        this.tracks.forEach((track) => {
            track.stop();
        });

        // Detener sonidos
        this.sound.stopAll();
        //this.sound.play('gameover');

        // Detener jugador
        this.player.stop();

        // Detener el contador de puntaje
        this.scoreTimer.destroy();

        // Verificar si hay un nuevo récord
        if (this.score > this.highscore) {
            this.highscoreText.setText('NEW!');
            this.registry.set('highscore', this.score);
        }

        // Reiniciar el juego con SPACE o un clic
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('MainMenu');
        }, this);

        this.input.once('pointerdown', () => {
            this.scene.start('MainMenu');
        }, this);
    }
}
