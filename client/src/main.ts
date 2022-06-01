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

monaco.languages.register({
  id: "typescript",
  extensions: [".ts", ".tsx"],
  aliases: ["TypeScript", "ts", "typescript"],
  mimetypes: ["text/typescript"],
});

const root = document.querySelector<HTMLDivElement>("#root")!;
monaco.editor.create(root, {
  model: monaco.editor.createModel(
    `
import {ExerciseType} from '../constants/practiceAndReviewLetterSets';
import {Exercise, LettersExercise} from './generateLetterExercises';

export const getNumOfCorrectCharacters = (
  input: string,
  text: string,
): number => {
  return Array.from(input).reduce((numCorrectCharacters, character, index) => {
    return numCorrectCharacters + (text.charAt(index) === character ? 1 : 0);
  }, 0);
};

export const isLettersExercise = (exercise: Exercise): boolean => {
  return (
    exercise.type === ExerciseType.PRACTICE ||
    exercise.type === ExerciseType.REVIEW
  );
};

export const assertLettersExercise = (
  exercise: Exercise,
): LettersExercise | never => {
  if (isLettersExercise(exercise)) {
    return exercise as LettersExercise;
  }

  throw new Error('Expected a LettersExercise');
};
`,
    undefined,
    monaco.Uri.parse(
      "file:///Users/dolevh/code/personal/hebrew-touch-typing/src/utils/exerciseUtils.ts"
    )
  ),
});

MonacoServices.install(monaco, {
  rootUri: "file:///Users/dolevh/code/personal/hebrew-touch-typing",
});

const url = createUrl("localhost", 3001, "/sampleServer");
console.log("URL", url);
const webSocket = new WebSocket(url);
webSocket.onopen = () => {
  const socket = toSocket(webSocket);
  const reader = new WebSocketMessageReader(socket);
  const writer = new WebSocketMessageWriter(socket);
  const languageClient = createLanguageClient({
    reader,
    writer,
  });
  languageClient.start();
  reader.onClose(() => languageClient.stop());

  console.log("wow", monaco.editor.getModels());
  console.log("wow", monaco.editor.setModel);
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
