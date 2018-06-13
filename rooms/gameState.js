"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const colyseus_1 = require("colyseus");
const player_1 = require("./objects/player");
class GameState {
    constructor(room) {
        this.prevTs = Date.now;
        this.players = {};
        this.room = room;
    }
    addPlayer(client) {
        this.players[client.sessionId] = new player_1.Player(client.sessionId, Math.floor(Math.random() * 500), Math.floor(Math.random() * 500), 0);
        this.room.send(client, { action: "Ready" });
    }
    movePlayer(client, x, y, angle, ts) {
        let player = this.players[client.sessionId];
        player.pendingChanges.push({ x, y, angle, ts });
        let delta = Date.now() - this.prevTs;
        this.prevTs = Date.now();
        let ack;
        while (player.pendingChanges.length > 0) {
            let move = player.pendingChanges.shift();
            player.x = move.x;
            player.y = move.y;
            player.angle = move.angle;
            ack = move.ts;
        }
        let message = { action: "Move", x: player.x, y: player.y, angle: player.angle, ts: ack };
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
