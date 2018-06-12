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
        this.clientConnected = false;

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
        let xDir = 0;
        let yDir = 0;
        if(this.keyW.isDown)
        {
            this.player.body.velocity.y -= 4;
        }
        else if(this.keyS.isDown)
        {
            this.player.body.velocity.y += 4;
        }
        if(this.keyD.isDown)
        {
            this.player.body.velocity.x += 4;
        }
        else if(this.keyA.isDown)
        {
            this.player.body.velocity.x -= 4;
        }
        try
        {
            this.sendMove(this.player.body.x,this.player.body.y);
        }
        catch(e)
        {
            console.log(e);
        };
        
        
        
    }

    sendMove(xDir,yDir)
    {
        let move = {action: "Move",xDir: xDir, yDir: yDir, ts: Date.now()};
        this.room.send(move);
        this.player.savedMoves.push(move);
        
    }

    joinRoom()
    {
        this.client = new Client("ws:localhost:2657");
        this.room = this.client.join("GameRoom");
    }

    playerListener()
    {
        this.room.listen("players/:id",(change) =>
        {
            if(change.path.id === this.room.sessionId)
            {
                this.player = new Player({scene: this, x: change.value.x, y: change.value.y, key: "Player"});
                this.player.id = change.path.id;
            }
            else
            {
                let newPlayer = new Player({scene: this, x: change.value.x, y: change.value.y, key: "Player"});
                console.log(newPlayer);
                newPlayer.id = change.path.id;
                this.playerGroup.add(newPlayer);
            }
            
        });
        this.room.listen("players/:id/:axis",(change)=>
        {
            if(change.path.id != this.room.sessionId)
            {
                
                if(change.path.axis === "x")
                {
                    let newPlayer = this.getPlayerById(change.path.id);
                    console.log("Id: "+ change.path.id +" x: " +newPlayer.x);
                    console.log("New x: " + change.value);
                    let tween = this.tweens.add({targets: newPlayer, x: change.value, duration: 5, ease: 'Power2'});
                }
                else if(change.path.axis === "y")
                {
                    let newPlayer = this.getPlayerById(change.path.id);
                    let tween = this.tweens.add({targets: newPlayer, y: change.value, duration: 5, ease: 'Power2'});
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
                    this.player.body.x = x;
                    this.player.body.y = y;
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
