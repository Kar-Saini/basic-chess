"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
class Game {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.startTime = new Date();
        this.moveCount = 0;
        this.player1.send(JSON.stringify({
            type: "init-game",
            payload: {
                color: "white",
            },
        }));
        this.player2.send(JSON.stringify({
            type: "init-game",
            payload: {
                color: "black",
            },
        }));
    }
    makeMove(socket, move) {
        if (this.player1 === socket || this.player2 === socket) {
            try {
                this.board.move(move);
                this.moveCount++;
            }
            catch (err) {
                console.log(err);
                return;
            }
        }
        if (this.board.isGameOver()) {
            this.player1.send(JSON.stringify({
                type: "game-over",
                payload: { winner: this.board.turn() === "w" ? "black" : "white" },
            }));
            this.player2.send(JSON.stringify({
                type: "game-over",
                payload: { winner: this.board.turn() === "w" ? "black" : "white" },
            }));
            return;
        }
        this.player1.send(JSON.stringify({
            type: "move",
            payload: { move },
        }));
        this.player2.send(JSON.stringify({
            type: "move",
            payload: { move },
        }));
    }
}
exports.Game = Game;
