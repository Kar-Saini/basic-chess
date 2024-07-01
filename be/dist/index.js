"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const GameManager_1 = require("./managers/GameManager");
const wss = new ws_1.WebSocketServer({ port: 8080 });
const gameManager = new GameManager_1.GameManager();
wss.on("connection", function (ws) {
    gameManager.addUser(ws);
    console.log("WS connected, user added");
    ws.on("disconnect", () => {
        gameManager.removeUser(ws);
        console.log("WS disconneted, user removed");
    });
    ws.send("WS Satrted on server 8080");
});
