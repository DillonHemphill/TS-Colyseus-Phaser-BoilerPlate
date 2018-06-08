import {EntityMap, Client, nosync, Clock, Room} from "colyseus"
import {Player} from "./objects/Player";

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
        this.players[client.sessionId] = new Player(client.sessionId, 100, 100, 0);
    }

    movePlayer(client, x,y,ts)
    {
        console.log("this being called");
        let player = this.players[client.sessionId];
        player.pendingChanges.push({x,y,ts});
        let delta = Date.now()-this.prevTs;
        this.prevTs = Date.now();
        let ack;
        while(this.players[client.sessionId].pendingChanges > 0)
        {
            
            let move = player.pendingChanges.shift();
            if(move.x != 0)
            {
                this.players[client.sessionId].x += move.x;
            }
            if(move.y != 0)
            {
                this.players[client.sessionId].y += move.y;
            }
            ack = move.ts;
        }
        let message = {action: "Move", x: player.x, y: player.y, ts: ack };
        this.room.send(client,message);
    }
}