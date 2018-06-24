/// <reference path="../../phaser.d.ts"/>
import 'phaser'

class Player extends Phaser.Physics.Arcade.Sprite
{
    constructor(config)
    {
        super(config.scene,config.x,config.y,config.key);
        this.id;
        this.savedMoves = [];
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setBounce(1).setCollideWorldBounds(true);
    }
}

export default Player;