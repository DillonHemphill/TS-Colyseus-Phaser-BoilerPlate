"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const colyseus_1 = require("colyseus");
const Player_1 = require("./objects/Player");
class GameState {
    constructor(room) {
        this.prevTs = Date.now;
        this.players = {};
        this.room = room;
    }
    addPlayer(client) {
        this.players[client.sessionId] = new Player_1.Player(client.sessionId, 100, 100, 0);
    }
    movePlayer(client, x, y, ts) {
        let player = this.players[client.sessionId];
        player.pendingChanges.push({ x, y, ts });
        let delta = Date.now() - this.prevTs;
        this.prevTs = Date.now();
        let ack;
        while (player.pendingChanges.length > 0) {
            console.log(player.pendingChanges.length);
            let move = player.pendingChanges.shift();
            this.players[client.sessionId].x = move.x;
            this.players[client.sessionId].y = move.y;
            ack = move.ts;
        }
        let message = { action: "Move", x: player.x, y: player.y, ts: ack };
        this.room.send(client, message);
    }
}
__decorate([
    colyseus_1.nosync
], GameState.prototype, "room", void 0);
__decorate([
    colyseus_1.nosync
], GameState.prototype, "prevTs", void 0);
exports.GameState = GameState;
