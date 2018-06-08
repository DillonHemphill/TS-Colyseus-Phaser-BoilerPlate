/// <reference path="../../phaser.d.ts"/>
import 'phaser'

class Player extends Phaser.Physics.Arcade.Sprite
{
    constructor(config)
    {
        super(config.scene,config.x,config.y,config.key);
        console.log(config);
        this.id;
        this.savedMoves = [];
        this.scene.physics.add.existing(this);
    }
}

export default Player;