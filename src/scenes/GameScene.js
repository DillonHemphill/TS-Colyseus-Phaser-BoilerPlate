/// <reference path="../phaser.d.ts"/>
import "phaser";
import {Client, Room, DataChange} from 'colyseus.js'
const player = require("./objects/player");
class GameScene extends Phaser.Scene 
{
    constructor(test) 
    {
        super({key: 'GameScene'});
        this.client;
        this.room;
        this.playerGroup = new Phaser.GameObjects.Group(this,{});
    }

    preload() 
    {
        
    }

    create() 
    {
       this.joinRoom();
       this.playerListener();
    }

    update(time, delta) 
    {
        
    }

    joinRoom()
    {
        this.client = new Client("ws://localhost:2657");
        this.room = this.client.join("GameRoom");
    }

    playerListener()
    {
        this.room.listen("players/:id",(change) =>
        {
            let config = {classType: player.Player, scene: this, x: change.value.x, y: change.value.y, key: "Player"};
            this.playerGroup.createFromConfig(config);
            let newPlayer = this.playerGroup.getChildren()[this.playerGroup.getLength()-1];
            newPlayer.id = change.path.id;
            console.log(newPlayer);
        });
    }

   
}

export default GameScene;
