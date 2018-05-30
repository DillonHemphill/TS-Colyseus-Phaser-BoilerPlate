const path = require("path");
const express = require("express");
const serveIndex = require("serve-index");
const http_1 = require("http");
const colyseus_1 = require("colyseus");

// Require BasicRoom handler
const gameRoom_1 = require("./rooms/gameRoom");

const port = Number(process.env.PORT || 2657);
const app = express();

// Create HTTP Server
const httpServer = http_1.createServer(app);

// Attach WebSocket Server on HTTP Server.
const gameServer = new colyseus_1.Server({ server: httpServer });
// Register BasicRoom as "GameRoom"
gameServer.register("GameRoom", gameRoom_1.GameRoom);

// Register BasicRoom with initial options, as "basic_with_options"
// onInit(options) will receive client join options + options registered here.
gameServer.register("basic_with_options", gameRoom_1.GameRoom, 
{
    custom_options: "you can use me on Room#onInit"
});

app.use(express.static(path.join(__dirname, "./dist")));
app.use('./', serveIndex(path.join(__dirname, "dist"), { 'icons': true }));
gameServer.listen(port);
console.log(`Listening on http://localhost:${port}`);
