import { Chess } from "chess.js";
import { WebSocket } from "ws";

export class Game {
  public player1: WebSocket;
  public player2: WebSocket;
  private board: Chess;
  private startTime: Date;
  private moveCount: number;

  constructor(player1: WebSocket, player2: WebSocket) {
    this.player1 = player1;
    this.player2 = player2;

    this.board = new Chess();
    this.startTime = new Date();
    this.moveCount = 0;

    this.player1.send(
      JSON.stringify({
        type: "init-game",
        payload: {
          color: "white",
        },
      })
    );

    this.player2.send(
      JSON.stringify({
        type: "init-game",
        payload: {
          color: "black",
        },
      })
    );
  }

  makeMove(socket: WebSocket, move: { from: string; to: string }) {
    if (this.player1 === socket || this.player2 === socket) {
      try {
        this.board.move(move);
        this.moveCount++;
      } catch (err) {
        console.log(err);
        return;
      }
    }
    if (this.board.isGameOver()) {
      this.player1.send(
        JSON.stringify({
          type: "game-over",
          payload: { winner: this.board.turn() === "w" ? "black" : "white" },
        })
      );
      this.player2.send(
        JSON.stringify({
          type: "game-over",
          payload: { winner: this.board.turn() === "w" ? "black" : "white" },
        })
      );
      return;
    }
    this.player1.send(
      JSON.stringify({
        type: "move",
        payload: { move },
      })
    );
    this.player2.send(
      JSON.stringify({
        type: "move",
        payload: { move },
      })
    );
  }
}
