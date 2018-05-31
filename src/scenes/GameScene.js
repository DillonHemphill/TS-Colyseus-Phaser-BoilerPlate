
class GameScene extends Phaser.Scene 
{
    constructor(test) 
    {
        super({key: 'GameScene'});
    }

    preload() 
    {
        
    }

    create() 
    {
       this.add.sprite(100,100,'Player');
    }

    update(time, delta) 
    {
        
    }

   
}

export default GameScene;
