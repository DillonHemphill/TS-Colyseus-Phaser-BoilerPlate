import {Room,Client} from "colyseus"
import {GameState} from "./gameState"
import { Player } from "./objects/Player";

export class GameRoom extends Room<GameState>
{
    maxClients = 4;

    onInit(options)
    {
        this.setState(new GameState(this));   
    }

    onJoin(client: Client)
    {
        this.state.addPlayer(client);
    }


    onMessage(client: Client,data: any)
    {
        if(data.action === "Move")
        {
            this.state.movePlayer(client,data.xDir,data.yDir,data.ts);
        }
    }

    onDispose()
    {
        
    }
}