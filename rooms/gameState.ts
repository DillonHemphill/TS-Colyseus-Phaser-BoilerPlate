import {EntityMap, Client, nosync, Clock, Room} from "colyseus"
import {Player} from "./objects/player";

export class GameState
{
    @nosync
    room: Room;

    @nosync
    prevTs: any = Date.now;

    players: EntityMap<Player> = {};

    constructor(room: Room)
    {
        this.room = room;
    }

    addPlayer(client: Client)
    {
        this.players[client.sessionId] = new Player(client.sessionId, Math.floor(Math.random() * 500), Math.floor(Math.random() * 500), 0);
        this.room.send(client,{action: "Ready"});
    }

    movePlayer(client, x,y,ts)
    {
        let player = this.players[client.sessionId];
        player.pendingChanges.push({x,y,ts});
        let delta = Date.now()-this.prevTs;
        this.prevTs = Date.now();
        let ack;
        
        while(player.pendingChanges.length > 0)
        {  
            let move = player.pendingChanges.shift();
            player.x = move.x;
            player.y = move.y;
            ack = move.ts;
        }
        let message = {action: "Move", x: player.x, y: player.y, ts: ack };
        this.room.send(client,message);
    }
}