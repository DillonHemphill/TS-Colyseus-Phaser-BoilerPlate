import 'phaser';
import BootScene from './scenes/BootScene';
import GameScene from './scenes/GameScene';

const config = {
    // For more settings see <https://github.com/photonstorm/phaser/blob/master/src/boot/Config.js>
    type: Phaser.CANVAS,
    pixelArt: true,
    parent: 'content',
    width: 1280,
    height: 720,
    scene: [
        BootScene,
        GameScene
    ]
};

const game = new Phaser.Game(config);