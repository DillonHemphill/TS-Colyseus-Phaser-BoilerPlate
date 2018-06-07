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
       this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
       this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
       this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
       this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    }

    update(time, delta) 
    {
        if(this.keyW.isDown)
        {
            this.sendMove(0,1);
        }
        else if(this.keyS.isDown)
        {
            this.sendMove(0,-1);
        }
        if(this.keyD.isDown)
        {
            this.sendMove(1,0);
        }
        else if(this.keyA.isDown)
        {
            this.sendMove(-1,0);
        }
    }

    sendMove(xDir,yDir)
    {
        var move = {action: "Move",xDir: xDir, yDir: yDir, ts: Date.now()};
        this.room.send(move);
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
