/// <reference path="../phaser.d.ts"/>
import "phaser";
class BootScene extends Phaser.Scene 
{
    constructor(test) 
    {
        super({key: 'BootScene'});
    }
    preload() 
    {
        this.load.image('Player', "assets/images/player.png");
        this.load.image("Ball","assets/images/ball.png");
        this.scene.start('GameScene');
    }
}

export default BootScene;
