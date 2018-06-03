const colyseus = require("colyseus");
const gameState = require("./gameState");
//GameRoom class, calls the gameState on first player join
class GameRoom extends colyseus.Room 
{
    //On Init of the server
    onInit(options) 
    {
        this.setState(new gameState.GameState());
        console.log("Server started");
    }
    //Runs anytime a player joins
    onJoin(client) 
    {
        console.log("Player joined");
        this.state.addPlayer(client);
    }
    //Runs anytime a player leaves
    onLeave(client) 
    {
        console.log("Player lefted");
    }
    //Runs anytime a message in sent to the server
    onMessage(client, data) 
    {

    }
    //Runs when the server is shutting down
    onDispose() 
    {

    }
}
exports.GameRoom = GameRoom;
