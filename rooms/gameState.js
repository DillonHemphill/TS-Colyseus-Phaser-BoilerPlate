//GameState, where the server game logic is excuted
const Player = require("./objects/player");
class GameState 
{

    constructor()
    {
        this.players = {};
    }

    addPlayer(client)
    {
        this.players[client.sessionId] = new Player.Player(client.sessionId, 100, 100, 0);
    }
}
exports.GameState = GameState;
