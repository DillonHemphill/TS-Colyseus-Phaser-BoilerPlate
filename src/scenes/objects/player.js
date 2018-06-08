/// <reference path="../../phaser.d.ts"/>
import 'phaser'

class Player extends Phaser.Physics.Arcade.Sprite
{
    constructor(config)
    {
        super(config.scene,config.x,config.y,config.key);
        console.log(config);
        this.scene.add.existing(this);
        
        this.id;
        this.savedMoves = [];
        
    }
}

export default Player;