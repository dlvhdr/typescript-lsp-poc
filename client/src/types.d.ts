import * as monaco from "monaco-editor";

declare global {
  interface Window {
    MonacoEnvironment: monaco.Environment | undefined;

    // eslint-disable-next-line camelcase
    __webpack_public_path__: string;
  }

  // eslint-disable-next-line camelcase
  declare let __webpack_public_path__: string;
}
