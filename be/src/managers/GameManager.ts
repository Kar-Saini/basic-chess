import { WebSocket } from "ws";
import { Game } from "./Game";

export class GameManager {
  private games: Game[];
  private users: WebSocket[];
  private pendingUser: WebSocket | null = null;
  constructor() {
    this.games = [];
    this.users = [];
  }

  addUser(webSokcet: WebSocket) {
    this.users.push(webSokcet);
    this.addHandler(webSokcet);
  }
  removeUser(webSocket: WebSocket) {
    this.users = this.users.filter((ws) => ws !== webSocket);
  }
  private addHandler(socket: WebSocket) {
    socket.on("message", (data: any) => {
      const parsedMessage = JSON.parse(data);

      switch (parsedMessage.type) {
        case "init-game":
          console.log("inside init game");
          //cheking is a pendiong user already exists
          if (this.pendingUser) {
            //pushing pendingUser and new user to Game class
            const game = new Game(this.pendingUser, socket);
            this.games.push(game);
            this.pendingUser = null;
          }
          //
          else {
            this.pendingUser = socket;
          }
          break;
        case "move":
          const game = this.games.find(
            (game) => game.player1 === socket || game.player2 === socket
          );
          if (game) {
            game.makeMove(socket, parsedMessage.payload.move);
          }
      }
    });
  }
}
/*

{"type":"init-game"}
{
    "type":"move",
    "move":{
      "from":"",
      "to":""
    }
  } */
