"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colyseus_1 = require("colyseus");
const gameState_1 = require("./gameState");
class GameRoom extends colyseus_1.Room {
    constructor() {
        super(...arguments);
        this.maxClients = 4;
    }
    onInit(options) {
        this.setState(new gameState_1.GameState(this));
    }
    onJoin(client) {
        this.state.addPlayer(client);
    }
    onMessage(client, data) {
        if (data.action === "Move") {
            this.state.movePlayer(client, data.xDir, data.yDir, data.angle, data.ts);
        }
    }
    onDispose() {
    }
}
exports.GameRoom = GameRoom;
