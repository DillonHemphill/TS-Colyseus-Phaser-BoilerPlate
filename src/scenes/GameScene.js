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
        this.player;
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
        console.log(move);
        this.room.send(move);
        let player = this.getPlayerById(this.room.sessionId);
        if(xDir == 1)
        {
            player.body.velocity.x += 4;
        }
        else if(xDir == -1)
        {
            player.body.velocity.x -= 4;
        }

        if(yDir == 1)
        {
            player.body.velocity.y += 4;
        }
        else if(yDir == -1)
        {
            player.body.velocity.y -= 4;
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
            if(change.path.id === this.room.sessionId)
            {
                this.player = new Player({scene: this, x: change.value.x, y: change.value.y, key: "Player"});
                console.log(newPlayer);
                this.player = change.path.id;
                this.playerGroup.add(newPlayer);
            }
            else
            {
                let newPlayer = new Player({scene: this, x: change.value.x, y: change.value.y, key: "Player"});
                console.log(newPlayer);
                newPlayer.id = change.path.id;
                this.playerGroup.add(newPlayer);
            }
            
        });
        this.room.listen("players/:id:axis",(change)=>
        {
            if(change.path.id != this.room.sessionId)
            {
                if(change.path.axis === x)
                {
                    let newPlayer = this.getPlayerById(change.path.id);
                    newPlayer.x = change.value;
                }
                else if(change.path.axis === y)
                {
                    let newPlayer = this.getPlayerById(change.path.id);
                    newPlayer.y = change.value;
                }
            }
        });
        
    }

    onMessage()
    {
        this.room.onMessage.add(function(message)
        {
            if(this.room)
            {
                if(message.action === "Move")
                {
                    let x = message.x;
                    let y = message.y;
                    let ts = message.ts;
                    let savedMoves = this.player.savedMoves.filter(savedMove => {savedMove.ts > ts});
                    this.savedMove.forEach(savedMove => 
                        {
                            x += savedMove.x * 400;
                            y += savedMove.y * 400;
                        })
                    this.player.x = x;
                    this.player.y = y; 
                    
                }
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
