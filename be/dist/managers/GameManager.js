"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const Game_1 = require("./Game");
class GameManager {
    constructor() {
        this.pendingUser = null;
        this.games = [];
        this.users = [];
    }
    addUser(webSokcet) {
        this.users.push(webSokcet);
        this.addHandler(webSokcet);
    }
    removeUser(webSocket) {
        this.users = this.users.filter((ws) => ws !== webSocket);
    }
    addHandler(socket) {
        socket.on("message", (data) => {
            const parsedMessage = JSON.parse(data);
            switch (parsedMessage.type) {
                case "init-game":
                    console.log("inside init game");
                    //cheking is a pendiong user already exists
                    if (this.pendingUser) {
                        //pushing pendingUser and new user to Game class
                        const game = new Game_1.Game(this.pendingUser, socket);
                        this.games.push(game);
                        this.pendingUser = null;
                    }
                    //
                    else {
                        this.pendingUser = socket;
                    }
                    break;
                case "move":
                    const game = this.games.find((game) => game.player1 === socket || game.player2 === socket);
                    if (game) {
                        game.makeMove(socket, parsedMessage.payload.move);
                    }
            }
        });
    }
}
exports.GameManager = GameManager;
/*

{"type":"init-game"}
{
    "type":"move",
    "move":{
      "from":"",
      "to":""
    }
  } */
