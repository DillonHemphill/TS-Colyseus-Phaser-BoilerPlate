/// <reference path="../phaser.d.ts"/>
import "phaser";
import {Client, Room, DataChange} from 'colyseus.js'
import Player from "./objects/player";
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
            let newPlayer = new Player({scene: this, x: change.value.x, y: change.value.y, key: "Player"});
            console.log(newPlayer);
            newPlayer.id = change.path.id;
            this.playerGroup.add(newPlayer);
        });

        this.room.listen("players/:id/:axis",(change) =>
        {
            if(change.path.axis === "x")
            {
                let player = this.getPlayerById(change.path.id);
                player.x = change.value;
            }
            else if(change.path.axis === "y")
            {
                let player = this.getPlayerById(change.path.id);
                player.y = change.value;
            }
        });
    }

    getPlayerById(id)
    {
        let player;
        this.playerGroup.getChildren().forEach((value)=>
        {
            if(value.id === id)
            {
                player = value;
            }
        });
        return player;
    }

   
}

export default GameScene;
