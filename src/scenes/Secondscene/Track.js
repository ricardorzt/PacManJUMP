import Ghost from './Ghost.js';
import PlayerPellet from './PlayerPellet.js'; 
import EnemyPellet from './EnemyPellet.js';   

export default class Track {
    constructor(scene, id, trackY) {
        this.scene = scene;
        this.id = id;
        this.y = trackY;

        // ✅ Crear dos fantasmas por pista
        this.ghost1 = new Ghost(scene, this);
        this.ghost2 = new Ghost(scene, this); // ✅ Segundo fantasma

        // ✅ Grupos de proyectiles
        this.playerProjectiles = scene.physics.add.group({
            frameQuantity: 8,
            key: 'sprites',
            frame: 'pellet',
            active: false,
            visible: false,
            classType: PlayerPellet 
        });

        this.enemyProjectiles = scene.physics.add.group({
            frameQuantity: 8,
            key: 'sprites',
            frame: 'enemy-pellet',
            active: false,
            visible: false,
            classType: EnemyPellet 
        });

        // ✅ Colisiones
        this.projectileCollider = scene.physics.add.overlap(this.playerProjectiles, this.enemyProjectiles, this.hitProjectile, null, this);
        this.ghost1Collider = scene.physics.add.overlap(this.ghost1, this.playerProjectiles, this.hitGhost, null, this);
        this.ghost2Collider = scene.physics.add.overlap(this.ghost2, this.playerProjectiles, this.hitGhost, null, this);

        this.releaseTimer1;
        this.releaseTimer2;
    }

    start(minDelay, maxDelay) {
        const delay = Phaser.Math.Between(minDelay, maxDelay);
        
        this.releaseTimer1 = this.scene.time.addEvent({
            delay: delay,
            callback: () => {
                this.ghost1.start();
            }
        });

        this.releaseTimer2 = this.scene.time.addEvent({
            delay: delay*3,
            callback: () => {
                this.ghost2.start();
            }
        });
    }

    stop() {
     this.ghost1.stop();
    this.ghost2.stop();

        for (let projectile of this.playerProjectiles.getChildren()) {
            projectile.stop();
        }

        for (let projectile of this.enemyProjectiles.getChildren()) {
            projectile.stop();
        }

    
        this.releaseTimer1.remove();
        this.releaseTimer2.remove();
       
    }

    hitProjectile(ball1, ball2) {
        ball1.stop();
        ball2.stop();
    }

    hitGhost(ghost, projectile) {
        if (ghost.isAlive && ghost.x > 0) {
            projectile.stop();
            ghost.hit();
        }
    }

    throwPlayerProjectile(x) {
        let projectile = this.playerProjectiles.getFirstDead(false);
        if (projectile) {
            projectile.fire(x, this.y);
        }
    }

    throwEnemyProjectile(x) {
        let projectile = this.enemyProjectiles.getFirstDead(false);
        if (projectile) {
            projectile.fire(x, this.y);
        }
    }
}
