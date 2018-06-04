/// <reference path="../../phaser.d.ts"/>
import 'phaser'

class Player extends Phaser.GameObjects.Sprite
{
    constructor(config)
    {
        super(config.scene,config.x,config.y,config.key);
        console.log(config);
        this.scene.add.existing(this);
        this.id;
        
    }
}

export default Player;