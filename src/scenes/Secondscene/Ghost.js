/*export default class Ghost extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, track) {
        const ghostColors = ['ghost-red', 'ghost-blue', 'ghost-green', 'ghost-yellow'];
        const frame = Phaser.Math.RND.pick(ghostColors); // Selecciona un color aleatorio
        const x = 80; // ✅ Todos los fantasmas inician fuera de la pantalla

        super(scene, x, track.y, frame);

        this.setOrigin(0.5, 1);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setSize(50, 50);
        this.body.setOffset(0, 0);

        this.time = scene.time;
        this.sound = scene.sound;

        this.isAlive = true;
        this.isThrowing = false;
        this.speed = 50; // ✅ Velocidad fija
        this.direction = 1; // ✅ Mueve de izquierda a derecha
        this.currentTrack = track;
    }

    start() {
        this.isAlive = true;
        this.isThrowing = false;

        this.y = this.currentTrack.y;

        this.setActive(true);
        this.setVisible(true);

        this.walk(); // ✅ Ahora los fantasmas comienzan a caminar de inmediato

        // ✅ Activa las acciones aleatorias después de cierto tiempo
        this.chooseEvent = this.time.delayedCall(Phaser.Math.Between(3000, 6000), this.chooseAction, [], this);
    }

    chooseAction() {
        if (!this.isAlive) return;

        this.setVelocityX(0); // Se detiene temporalmente

        const t = Phaser.Math.Between(0, 100);

        if (t < 50) {
            if (this.previousAction === 2) {
                this.walk();
            } else {
                this.throw();
            }
        } else if (t > 60) {
            this.walk();
        } else {
            if (this.previousAction === 1) {
                this.walk();
            } else {
                this.goIdle();
            }
        }
    }

    walk() {
        if (!this.isAlive) return;

        this.previousAction = 0;

        this.setVelocityX(this.speed * this.direction);

        // ✅ Los fantasmas siguen moviéndose y eligen su siguiente acción
        this.chooseEvent = this.time.delayedCall(Phaser.Math.Between(3000, 6000), this.chooseAction, [], this);
    }

    goIdle() {
        if (!this.isAlive) return;

        this.previousAction = 1;

        this.chooseEvent = this.time.delayedCall(Phaser.Math.Between(2000, 4000), this.chooseAction, [], this);
    }

    throw() {
        if (!this.isAlive) return;

        this.previousAction = 2;
        this.isThrowing = true;

        this.scene.time.delayedCall(500, () => {
            if (this.isAlive) {
                this.releaseProjectile();
            }
        });

        this.chooseEvent = this.time.delayedCall(Phaser.Math.Between(2000, 4000), this.chooseAction, [], this);
    }

    releaseProjectile() {
        if (!this.isAlive) return;
        this.currentTrack.throwEnemyProjectile(this.x);
    }

    hit() {
        if (this.chooseEvent) this.chooseEvent.remove();

        this.isAlive = false;
        this.body.stop();
        this.body.enable = false;

        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: 500,
            onComplete: () => this.destroy()
        });
    }

    stop() {
        if (this.chooseEvent) this.chooseEvent.remove();

        this.isAlive = false;
        this.setVelocityX(0);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (this.x >= 880) {
            this.stop();
        }
    }
}*/ 
export default class Ghost extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, track) {
        // Lista de colores de fantasmas disponibles
        const ghostColors = ['ghost-red', 'ghost-blue', 'ghost-green', 'ghost-yellow'];
        const randomGhost = Phaser.Math.RND.pick(ghostColors); // Selecciona un color al azar
        const x = 80; // Posición inicial aleatoria dentro del rango de la pista

        super(scene, x, track.y, randomGhost); // ✅ Usa la imagen correcta del fantasma

        this.setOrigin(0.5, 1);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setSize(50, 50);
        this.body.setOffset(0, 0);

        this.time = scene.time;
        this.sound = scene.sound;

        this.isAlive = true;
        this.isThrowing = false;
        this.speed = 50; // Velocidad aleatoria para cada fantasma

        this.currentTrack = track;
        this.ghostColor = randomGhost; // Almacena el color del fantasma

        // Movimiento inicial
        this.setVelocityX(this.speed);
        this.direction = 1; // 1 = derecha, -1 = izquierda
    }

    start() {
        this.isAlive = true;
        this.isThrowing = false;

        this.y = this.currentTrack.y;
        this.previousAction = 0;

        this.setActive(true);
        this.setVisible(true);

        // Velocidad inicial
        this.setVelocityX(this.speed * this.direction);

        this.chooseEvent = this.time.delayedCall(Phaser.Math.Between(5000, 7000), this.chooseAction, [], this);
        
        
    }

    chooseAction ()
    {
        //  In case it was disabled by a hit
        this.isAlive = true;
        this.body.enable = true;

        this.setVelocityX(0);

        //  0 - 50 = Throw snowball
        //  51 - 60 = Idle
        //  61 - 100 = Walk 
        const t = Phaser.Math.Between(0, 100);

        if (t < 50)
        {
            //  If it threw last time, we don't throw again
            if (this.previousAction === 2)
            {
                this.walk();
            }
            else
            {
                this.throw();
            }
        }
        else if (t > 60)
        {
            this.walk();
        }
        else
        {
            //  If it was idle last time, we don't go idle again
            if (this.previousAction === 1)
            {
                if (t > 55)
                {
                    this.walk();
                }
                else
                {
                    this.throw();
                }
            }
            else
            {
                this.goIdle();
            }
        }
    } 
    walk() {
        if (!this.isAlive) return;

        this.previousAction = 0;

        this.setVelocityX(this.speed * this.direction);

        this.chooseEvent = this.time.delayedCall(Phaser.Math.Between(3000, 6000), this.chooseAction, [], this);
    }

    goIdle ()
    {
        this.previousAction = 1;

//        this.play('snowmanIdle' + this.size, true);

        this.chooseEvent = this.time.delayedCall(Phaser.Math.Between(2000, 4000), this.chooseAction, [], this);
    }

    throw() {
        if (!this.isAlive || this.isThrowing) return; // ✅ Evita disparos si ya está lanzando
    
        this.previousAction = 2;
        this.isThrowing = true;
    
        console.log("🔥 Fantasma intentará disparar...");
    
        this.scene.time.delayedCall(500, () => {
            if (this.isAlive) {
                console.log("💨 Fantasma lanza proyectil...");
                this.releaseProjectile();
            }
        });
    
        this.scene.time.delayedCall(2000, () => {
            this.isThrowing = false; // ✅ Permitir disparos nuevamente
        });
    
        this.chooseEvent = this.time.delayedCall(Phaser.Math.Between(2000, 4000), this.chooseAction, [], this);
    }
    

    releaseProjectile() {
        if (!this.isAlive) {
            return;
        }
        this.currentTrack.throwEnemyProjectile(this.x);
    }

    throwComplete ()
    {
        if (!this.isAlive)
        {
            return;
        }

        this.isThrowing = false;

        this.chooseEvent = this.time.delayedCall(Phaser.Math.Between(2000, 4000), this.chooseAction, [], this);
    }


    hit() {
        if (this.chooseEvent) {
            this.chooseEvent.remove();
        }

        this.isAlive = false;
       // this.sound.play('hit-ghost');

        this.body.stop();
        this.body.enable = false;
        //this.setVisible(false);

        const knockback = '-=' + Phaser.Math.Between(100, 200).toString();

        this.scene.tweens.add({
            targets: this,
            x: knockback,
            ease: 'sine.out',
            duration: 1000,
            onComplete: () => {
                if (this.x < -100)
                    {
                        this.x = 80;
                    }
            }
        });

        this.chooseEvent = this.time.delayedCall(Phaser.Math.Between(1000, 3000), this.chooseAction, [], this);
    }

    stop() {
        if (this.chooseEvent) {
            this.chooseEvent.remove();
        }

        this.isAlive = false;
        this.setVelocityX(0);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (this.x >= 880) {
            this.stop();
            this.scene.gameOver();
        }
    }
} 
