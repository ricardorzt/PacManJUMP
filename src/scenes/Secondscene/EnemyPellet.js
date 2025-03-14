export default class EnemyPellet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'enemy-pellet'); // Ahora usa el nuevo sprite

        this.setScale(0.5);
    }

    fire(x, y) {
        this.body.enable = true;
        this.body.reset(x + 10, y - 20);

        this.setActive(true);
        this.setVisible(true);

        this.setVelocityX(200); // Velocidad de disparo
    }

    stop() {
        this.setActive(false);
        this.setVisible(false);

        this.setVelocityX(0);

        this.body.enable = false;
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        // Si el proyectil sale de la pantalla, lo desactiva
        if (this.x >= 970) {
            this.stop();
            this.scene.gameOver();
        } else{
            if(this.x >= 885){
                this.stop();
                this.scene.gameOver();  
            }
        }
    }
}
