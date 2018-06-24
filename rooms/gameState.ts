import {EntityMap, Client, nosync, Clock, Room} from "colyseus"
import {Player} from "./objects/player";
import { Ball } from "./objects/ball";
import * as uuid from 'uuid';

export class GameState
{
    @nosync
    room: Room;

    @nosync
    prevTs: any = Date.now;

    players: EntityMap<Player> = {};
    balls: EntityMap<Ball> = {};

    constructor(room: Room)
    {
        this.room = room;
    }

    addPlayer(client: Client)
    {
        this.players[client.sessionId] = new Player(client.sessionId, Math.floor(Math.random() * 500), Math.floor(Math.random() * 500), 0);
        this.room.send(client,{action: "Ready"});
        this.createBall();
    }

    movePlayer(client, x,y, angle,ts)
    {
        let player = this.players[client.sessionId];
        player.pendingChanges.push({x,y,angle,ts});
        let delta = Date.now()-this.prevTs;
        this.prevTs = Date.now();
        let ack;
        
        while(player.pendingChanges.length > 0)
        {  
            let move = player.pendingChanges.shift();
            player.x = move.x;
            player.y = move.y;
            player.angle = move.angle;
            ack = move.ts;
        }
        let message = {action: "Move", x: player.x, y: player.y, angle: player.angle, ts: ack };
        this.room.send(client,message);
    }

    createBall()
    {
        let uuidString = uuid();
        this.balls[uuidString] = new Ball(uuidString,200,200,0);
    }
}