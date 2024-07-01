import { WebSocket, WebSocketServer } from "ws";
import { GameManager } from "./managers/GameManager";

const wss = new WebSocketServer({ port: 8080 });
const gameManager = new GameManager();

wss.on("connection", function (ws) {
  gameManager.addUser(ws);
  console.log("WS connected, user added");

  ws.on("disconnect", () => {
    gameManager.removeUser(ws);
    console.log("WS disconneted, user removed");
  });

  ws.send("WS Satrted on server 8080");
});
