import { spawn } from "node:child_process";
import path from "path";

export function launch() {
  // const reader = new rpc.WebSocketMessageReader(socket);
  // const writer = new rpc.WebSocketMessageWriter(socket);

  // start the language server inside the current process
  // start(reader, writer);
  // spawn("yarn typescript-language-server --stdio");
  spawn("node", [
    path.join(
      __dirname,
      "../node_modules/typescript-language-server/lib/cli.js"
    ),
    "--stdio",
  ]);
}
