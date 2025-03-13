import Firstscene from "./scenes/Firstscene.js"; // Importamos la escena principal

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: "container",
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [Firstscene] // Especificamos la escena inicial
};

const game = new Phaser.Game(config);
