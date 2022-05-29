import path from "path";
import * as rpc from "@codingame/monaco-jsonrpc";
import * as lsp from "vscode-languageserver";

import * as server from "@codingame/monaco-jsonrpc/lib/server";

export function launch(socket: rpc.IWebSocket) {
  const reader = new rpc.WebSocketMessageReader(socket);
  const writer = new rpc.WebSocketMessageWriter(socket);
  // start the language server as an external process
  const tlsPath = path.join(
    __dirname,
    "../node_modules/typescript-language-server/lib/cli.js"
  );
  const socketConnection = server.createConnection(reader, writer, () =>
    socket.dispose()
  );
  const serverConnection = server.createServerProcess(
    "typescript-language-server",
    "node",
    [tlsPath, "--stdio"]
  );
  server.forward(socketConnection, serverConnection, (message) => {
    console.log("[Server] got message", message);
    console.log(
      "expecting",
      lsp.InitializeRequest.type.method,
      "isRequest",
      rpc.Message.isRequest(message)
    );

    if (rpc.Message.isRequest(message)) {
      if (message.method === lsp.InitializeRequest.type.method) {
        const initializeParams = message.params as lsp.InitializeParams;
        console.log("[Server] InitializeParams", initializeParams);
        initializeParams.processId = process.pid;
      }
    }
    return message;
  });
}
