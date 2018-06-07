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
       this.onMessage();
       
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
        let move = {action: "Move",xDir: xDir, yDir: yDir, ts: Date.now()};
        this.room.send(move);
        let player = this.getPlayerById(this.room.id);
        if(xDir == 1)
        {
            player.body.velocity.x += 400;
        }
        else if(xDir == -1)
        {
            player.body.velocity.x -= 400;
        }

        if(yDir == 1)
        {
            player.body.velocity.y += 400;
        }
        else if(yDir == -1)
        {
            player.body.velocity.y -= 400;
        }
        player.savedMoves.push(move);
        
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

    onMessage()
    {
        this.room.onMessage.add(function(message)
        {
            if(message.action === "Move")
            {
                let x = message.x;
                let y = message.y;
                let ts = message.ts;
                let savedMoves = this.getPlayerById(this.room.id).savedMoves.filter(savedMove => {savedMove.ts > ts});
                this.savedMove.forEach(savedMove => 
                    {
                        x += savedMove.x * 400;
                        y += savedMove.y * 400;
                    })
                this.getPlayerById(this.room.id).x = x;
                this.getPlayerById(this.room.id).y = y; 
                
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
