/// <reference path="../../phaser.d.ts"/>
import 'phaser'

class Player extends Phaser.GameObjects.Sprite
{
    constructor(scene,x,y,key)
    {
        super(scene,x,y,key);
        this.id;
    }
}

export default Player;