/// <reference path="../phaser.d.ts"/>
import "phaser";
import {Client, Room, DataChange} from 'colyseus.js'
class GameScene extends Phaser.Scene 
{
    constructor(test) 
    {
        super({key: 'GameScene'});
        this.client;
        this.room;
    }

    preload() 
    {
        
    }

    create() 
    {
       this.joinRoom();
    }

    update(time, delta) 
    {
        
    }

    joinRoom()
    {
        this.client = new Client("ws://localhost:2657");
        this.room = this.client.join("GameRoom");
    }

   
}

export default GameScene;
