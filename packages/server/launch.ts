import path from "path";
import fs from "fs";
import * as rpc from "@codingame/monaco-jsonrpc";
import * as lsp from "vscode-languageserver";
import os from "os";
import * as server from "@codingame/monaco-jsonrpc/lib/server";
import { WORKSPACE_PATH } from "./consts";

export function launch(socket: rpc.IWebSocket) {
  const reader = new rpc.WebSocketMessageReader(socket);
  const writer = new rpc.WebSocketMessageWriter(socket);

  // start the language server as an external process
  const tlsPath = path.join(
    __dirname,
    "../../node_modules/typescript-language-server/lib/cli.js"
  );

  const socketConnection = server.createConnection(reader, writer, () =>
    socket.dispose()
  );
  const serverConnection = server.createServerProcess(
    "typescript-language-server",
    "node",
    [
      tlsPath,
      "--stdio",
      "--log-level",
      "4",
      "--tsserver-log-verbosity",
      "verbose",
      "--tsserver-log-file",
      path.join(os.homedir(), "lsp-logs", ".lsp-log"),
    ]
  );

  server.forward(socketConnection, serverConnection, (message) => {
    if (
      //@ts-ignore
      message.method === "window/logMessage" ||
      //@ts-ignore
      message.method === "initialize"
    ) {
      return message;
    }
    console.log("[Server] got message", message);
    if (rpc.Message.isRequest(message)) {
      if (message.method === lsp.InitializeRequest.type.method) {
        const initializeParams = message.params as lsp.InitializeParams;
        console.log("[Server] InitializeParams", initializeParams);
        initializeParams.processId = process.pid;
        initializeParams.workspaceFolders = [
          {
            name: "statics",
            uri: `file://${WORKSPACE_PATH}`,
          },
        ];
      }
    }

    if (rpc.Message.isNotification(message)) {
      if (message.method === lsp.DidOpenTextDocumentNotification.type.method) {
        const params = message.params as lsp.DidOpenTextDocumentParams;

        const [, fullPath] = params.textDocument.uri.split("//");
        if (!fullPath.includes("node_modules")) {
          if (!fs.existsSync(fullPath)) {
            fs.writeFileSync(fullPath, params.textDocument.text);
          }
          // handle jsw.d.ts files generation
          if (fullPath.includes(".jsw.d.ts") || fullPath.includes(".jsw")) {
            // handleJSWChanges(message);
          }
        }
      }
    }
    return message;
  });
}
