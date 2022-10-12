import "./style.css";
import "monaco-editor/esm/vs/editor/editor.all.js";
import {
  ICodeEditorService,
  INotificationService,
  StandaloneServices,
} from "vscode/services";
import * as vscode from "vscode";
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
import "./code-code/theme";
import "./code-code/registerCompletionItemProvider";
import { DEFAULT_LANGUAGE, LANG_CONF } from "./code-code/consts";
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
import { fetchResource } from "./models";
import { registerAddNewModelForm } from "./newModelForm";
import { initializeServices } from "./services";

initializeServices();

//@ts-ignore
window.getFileContext = () => {
  // @ts-ignore
  const uri = window.editor.getModel().uri.toString();
  if (uri.includes("/page/")) {
    return "page";
  }
  if (uri.includes("/backend/")) {
    return "backend";
  }
  if (uri.includes("/public/")) {
    return "public";
  }
  return "page";
};

monaco.languages.register({
  id: DEFAULT_LANGUAGE,
  extensions: [".ts", ".tsx", ".js", ".jsx"],
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
  conf: monaco.languages.LanguageConfiguration
): monaco.IDisposable => {
  conf.autoClosingPairs = [
    { open: "(", close: ")" },
    { open: "[", close: "]" },
    { open: "{", close: "}" },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
  ];
  if (languageId === DEFAULT_LANGUAGE) {
    // Intentionally leave out "#" although Monaco ships with it, since it screws up code completion with nicknames
    conf.wordPattern = /(-?\d*\.\d\w*)|([^`~!@%^&*()=+[{\]}\\|;:'",.<>/?\s]+)/g;
  }

  return _setLanguageConfiguration(languageId, conf);
};
// @ts-ignore
monaco.languages.setLanguageConfiguration(DEFAULT_LANGUAGE, LANG_CONF);

const veloProvider = {
  provideTextDocumentContent: async (uri: monaco.Uri) => {
    const resource = await fetchResource(uri).catch((e) => {
      StandaloneServices.get(INotificationService).error(e);
      throw e;
    });
    return resource;
  },
};
vscode.workspace.registerTextDocumentContentProvider("velo", veloProvider);

//@ts-ignore
window.monaco = monaco;

let rootUri: string;
MonacoServices.install();
const url = createUrl("localhost", 3001, "/sampleServer");
const webSocket = new WebSocket(url);
webSocket.onopen = async () => {
  const socket = toSocket(webSocket);
  const reader = new WebSocketMessageReader(socket);
  const writer = new WebSocketMessageWriter(socket);
  rootUri = await fetch("http://localhost:3001/root").then((msg) => msg.text());
  const languageClient = createLanguageClient({
    reader,
    writer,
  });
  await languageClient.start();
  reader.onClose(() => languageClient.stop());

  const codeEditorService = StandaloneServices.get(ICodeEditorService);
  const editor = await codeEditorService.openCodeEditor(
    { resource: monaco.Uri.parse(`velo:page/home.ts`) },
    null
  );
  editor?.focus();

  registerAddNewModelForm();

  webSocket.send(
    JSON.stringify({
      method: "workspace/didChangeConfiguration",
      params: {
        settings: {
          typescript: {
            format: {
              baseIndentSize: 1,
            },
          },
        },
      },
    })
  );
};

//@ts-ignore
window.webSocket = webSocket;
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
      progressOnInitialization: true,
      uriConverters: {
        code2Protocol: (uri: any) => {
          const parsed = monaco.Uri.parse(uri).fsPath;
          const res = monaco.Uri.parse(rootUri + parsed).toString();
          return res;
        },
        protocol2Code: (str) => {
          const parsed = monaco.Uri.parse("velo:" + str.slice(rootUri.length));
          return parsed;
        },
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
