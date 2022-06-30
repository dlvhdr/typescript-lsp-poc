import path from "path";
import express from "express";
import http from "http";
import net from "net";
import * as ws from "ws";
import url from "url";
import * as rpc from "@codingame/monaco-jsonrpc";
import { launch } from "./launch";
import cors from "cors";

const app = express();
app.use(cors());
app.all("/", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Content-Type", "text/html");
  next();
});

app.use(express.static(path.join(__dirname, "../../statics")));
const server = app.listen(3001, () => {
  console.log("Started server on port 3001");
});
const wss = new ws.Server({
  noServer: true,
  perMessageDeflate: false,
});

server.on(
  "upgrade",
  (request: http.IncomingMessage, socket: net.Socket, head: Buffer) => {
    console.log("Got request");
    const pathname = request.url ? url.parse(request.url).pathname : undefined;
    console.log("pathname", pathname);
    if (pathname === "/sampleServer") {
      wss.handleUpgrade(request, socket, head, (webSocket) => {
        const socket: rpc.IWebSocket = {
          send: (content) =>
            webSocket.send(content, (error) => {
              if (error) {
                throw error;
              }
            }),
          onMessage: (cb) => webSocket.on("message", cb),
          onError: (cb) => webSocket.on("error", cb),
          onClose: (cb) => webSocket.on("close", cb),
          dispose: () => webSocket.close(),
        };
        // launch the server when the web socket is opened
        if (webSocket.readyState === webSocket.OPEN) {
          launch(socket);
          console.log("Launched typescript language server");
        } else {
          console.log("Will launch typescript language server");
        }
      });
    }
  }
);
