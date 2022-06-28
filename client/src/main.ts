import "./style.css";
import "monaco-editor/esm/vs/editor/editor.all.js";

// support all editor features
import "monaco-editor/esm/vs/editor/standalone/browser/accessibilityHelp/accessibilityHelp.js";
import "monaco-editor/esm/vs/editor/standalone/browser/inspectTokens/inspectTokens.js";
import "monaco-editor/esm/vs/editor/standalone/browser/iPadShowKeyboard/iPadShowKeyboard.js";
import "monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneHelpQuickAccess.js";
import "monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneGotoLineQuickAccess.js";
import "monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneGotoSymbolQuickAccess.js";
import "monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneCommandsQuickAccess.js";
import "monaco-editor/esm/vs/editor/standalone/browser/quickInput/standaloneQuickInputService.js";
import "monaco-editor/esm/vs/editor/standalone/browser/referenceSearch/standaloneReferenceSearch.js";
import "monaco-editor/esm/vs/editor/standalone/browser/toggleHighContrast/toggleHighContrast.js";

import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

import { buildWorkerDefinition } from "monaco-editor-workers";
buildWorkerDefinition("dist", new URL("", window.location.href).href, false);

import {
  MonacoLanguageClient,
  CloseAction,
  ErrorAction,
  MonacoServices,
  MessageTransports,
} from "monaco-languageclient";
import normalizeUrl from "normalize-url";
import {
  toSocket,
  WebSocketMessageReader,
  WebSocketMessageWriter,
} from "@codingame/monaco-jsonrpc";
import monacoTokensProvider from "./monarch";
import { createModel } from "./models";
import { TextModelService } from "./TextModelService";

monaco.languages.register({
  id: "typescript",
  extensions: [".ts", ".tsx", "js", "jsx"],
  aliases: ["TypeScript", "ts", "typescript"],
  mimetypes: ["text/typescript"],
});

monaco.languages.setMonarchTokensProvider(
  "typescript",
  monacoTokensProvider as monaco.languages.IMonarchLanguage
);

const root = document.querySelector<HTMLDivElement>("#root")!;

// const allModels = [];

const editor = monaco.editor.create(root, undefined, {
  textModelService: new TextModelService(),
});

// what makes the server to look for the siteSample dir?
const rootUri = "file:///Users/kobin/dev/typescript-lsp-poc/statics";
MonacoServices.install(monaco, {
  rootUri,
});

const url = createUrl("localhost", 3001, "/sampleServer");
const webSocket = new WebSocket(url);
webSocket.onopen = async () => {
  const socket = toSocket(webSocket);
  const reader = new WebSocketMessageReader(socket);
  const writer = new WebSocketMessageWriter(socket);
  const languageClient = createLanguageClient({
    reader,
    writer,
  });
  await languageClient.start();
  reader.onClose(() => languageClient.stop());
  const newModel = await createModel(
    monaco.Uri.parse(`${rootUri}/backend/main.ts`)
  );
  editor.setModel(newModel!);
};

function createLanguageClient(
  transports: MessageTransports
): MonacoLanguageClient {
  return new MonacoLanguageClient({
    name: "Sample Language Client",
    clientOptions: {
      // use a language id as a document selector
      documentSelector: ["typescript"],
      // disable the default error handler
      errorHandler: {
        error: () => ({ action: ErrorAction.Continue }),
        closed: () => ({ action: CloseAction.DoNotRestart }),
      },
    },
    // create a language client connection from the JSON RPC connection on demand
    connectionProvider: {
      get: () => {
        return Promise.resolve(transports);
      },
    },
  });
}

function createUrl(hostname: string, port: number, path: string): string {
  const protocol = location.protocol === "https:" ? "wss" : "ws";
  return normalizeUrl(`${protocol}://${hostname}:${port}${path}`);
}
