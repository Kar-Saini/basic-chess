import { useEffect, useState } from "react";
import { Chess, Square } from "chess.js";
const Room = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [from, setFrom] = useState<Square | null>(null);
  const [to, setTo] = useState<Square | null>(null);
  const [start, setStart] = useState(false);
  useEffect(() => {
    const webSocketConnnection = new WebSocket("ws://localhost:8080");
    webSocketConnnection.onopen = () => {
      console.log("connected");
      setSocket(webSocketConnnection);
    };
    webSocketConnnection.onclose = () => {
      console.log("disconnected");
      setSocket(null);
    };
    return () => {
      webSocketConnnection.close();
    };
  }, []);

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case "init-game":
          setBoard(chess.board());
          console.log("Game inititalized");
          break;
        case "move":
          console.log(message.payload.move);
          chess.move(message.payload.move);
          setBoard(chess.board());
          console.log("Moved");
          break;
        case "game-over":
          console.log("game Over");
          break;
      }
    };
  }, [socket, chess]);
  console.log(board);
  return (
    <div className="flex justify-around items-center bg-slate-950 h-screen">
      <div className="text-black font-bold">
        {board.map((row, i) => (
          <div key={i} className="flex">
            {row.map((square, j) => {
              const sq = (String.fromCharCode(97 + (j % 8)) +
                "" +
                (8 - i)) as Square;
              return (
                <div
                  onClick={() => {
                    if (!from) {
                      setFrom(sq);
                      console.log(sq);
                    } else {
                      const move = { from, to: sq };
                      socket?.send(
                        JSON.stringify({
                          type: "move",
                          payload: {
                            move,
                          },
                        })
                      );
                      if (from && to)
                        chess.move({
                          from: from.toString(),
                          to: to?.toString(),
                        });
                      setBoard(chess.board());
                      console.log("board updated");
                      setFrom(null);
                      setTo(null);
                    }
                  }}
                  key={j}
                  className={`w-20 h-20 ${
                    (i + j) % 2 === 0 ? "bg-slate-700" : "bg-slate-100"
                  } flex flex-col justify-between items-center rounded-sm`}
                >
                  <div className="text-2xl mt-3">{square?.type}</div>
                  <div className="font-thin text-sm text-neutral-800">{sq}</div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div>
        {!start && (
          <button
            className="text-5xl font-bold text-white bg-slate-700 px-6 py-4 text-center flex items-center justify-center rounded-lg hover:bg-slate-800 "
            onClick={() => {
              socket?.send(JSON.stringify({ type: "init-game" }));
              setStart(true);
            }}
          >
            Start Game
          </button>
        )}
      </div>
    </div>
  );
};

export default Room;
