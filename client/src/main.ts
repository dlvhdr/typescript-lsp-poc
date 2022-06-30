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
import "./code-code/theme"
import "./code-code/registerCompletionItemProvider"
import { EDITOR_OPTINS, DEFAULT_LANGUAGE, LANG_CONF } from "./code-code/consts"
import {setModulesCompletions} from "./code-code/monacoCompletions/wixModules";
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
//@ts-ignore
window.getFileContext = () => {
  // @ts-ignore
  const uri = window.editor.getModel().uri.toString();
  console.log("################################################################################", uri);
  if(uri.includes("/page/")) {
    return "page";
  }
  if(uri.includes("/backend/")) {
    return "backend";
  }
  if(uri.includes("/public/")) {
    return "public";
  }
  return "page";
}



monaco.languages.register({
  id: DEFAULT_LANGUAGE,
  extensions: [".ts", ".tsx", "js", "jsx"],
  aliases: ["TypeScript", "ts", DEFAULT_LANGUAGE],
  mimetypes: [`text/${DEFAULT_LANGUAGE}`],
});

monaco.languages.setMonarchTokensProvider(
  DEFAULT_LANGUAGE,
  monacoTokensProvider as monaco.languages.IMonarchLanguage
);

const _setLanguageConfiguration = monaco.languages.setLanguageConfiguration;

monaco.languages.setLanguageConfiguration = (
  languageId: string,
  conf: monaco.languages.LanguageConfiguration,
): monaco.IDisposable => {
  conf.autoClosingPairs = [{ open: "(", close: ")" }, { open: "[", close: "]"}, { open: "{", close: "}"}, { open: "\"", close: "\""}, { open: "'", close: "'"}];
  if (languageId === DEFAULT_LANGUAGE) {
    // Intentionally leave out "#" although Monaco ships with it, since it screws up code completion with nicknames
    conf.wordPattern = /(-?\d*\.\d\w*)|([^`~!@%^&*()=+[{\]}\\|;:'",.<>/?\s]+)/g;
  }

  return _setLanguageConfiguration(languageId, conf);
};
// @ts-ignore
monaco.languages.setLanguageConfiguration(DEFAULT_LANGUAGE, LANG_CONF);



const root = document.querySelector<HTMLDivElement>("#root")!;

// const allModels = [];

const editor = monaco.editor.create(root, EDITOR_OPTINS, {
  textModelService: new TextModelService(),
});
//@ts-ignore
window.editor = editor

editor.onDidChangeModel(
  async ({
    oldModelUrl,
    newModelUrl,
  }: monaco.editor.IModelChangedEvent) => {
    console.log("################################################################################", oldModelUrl);
    console.log("################################################################################", newModelUrl);
    setModulesCompletions();
  })
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
    monaco.Uri.parse(`${rootUri}/page/home.ts`)
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
