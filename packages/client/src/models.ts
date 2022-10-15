import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import {
  ICodeEditorService,
  StandaloneServices,
} from "@codingame/monaco-vscode-api/services";

export const createModel = async (
  uri: monaco.Uri
): Promise<monaco.editor.ITextModel> => {
  const existingModel = monaco.editor.getModel(uri);
  if (existingModel !== null) {
    return existingModel;
  }
  const fileContents = await fetchResource(uri);

  return monaco.editor.createModel(fileContents!, undefined, uri);
};

export const fetchResource = async (uri: monaco.Uri): Promise<string> => {
  let fsPath = uri.path;
  if (
    fsPath.startsWith("backend/") &&
    !fsPath.endsWith(".jsw.ts") &&
    !fsPath.endsWith(".jsw.d.ts")
  ) {
    fsPath = fsPath.replace(/\.ts$/, ".jsw.ts");
  }
  const url = `http://localhost:3001/${fsPath}`;
  const fileContents = await fetch(url, {
    method: "GET",
    mode: "cors",
  })
    .then(async (res) => {
      if (res.status === 404) {
        throw new Error("Not found");
      }
      const text = await res.text();
      return text;
    })
    .catch((e) => {
      console.error(`Original error`, e);
      throw new Error(`Model ${uri.path} wasn't found. Url: ${url}`);
    });

  return String(fileContents);
};

export const createTab = (uri: monaco.Uri) => {
  const tabs = window.document.querySelector("#tabs");

  const existingTabs = Array.from(tabs?.querySelectorAll("button") ?? []).map(
    (tab) => tab.innerText
  );
  if (existingTabs.includes(uri.toString())) {
    return;
  }

  const node = window.document.createElement("button");
  node.textContent = uri.fsPath;
  node.onclick = async () => {
    const codeEditorService = StandaloneServices.get(ICodeEditorService);
    const newCodeEditor = await codeEditorService.openCodeEditor(
      { resource: uri },
      null
    );
    newCodeEditor != null && appendCodeEditorToBody(newCodeEditor);
    removeActiveTabClass();
    node.classList.add("active");
  };
  removeActiveTabClass();
  node.classList.add("active");
  tabs!.appendChild(node);
};

const removeActiveTabClass = () => {
  document
    .querySelectorAll("#tabs > button")
    .forEach((tab) => tab.classList.remove("active"));
};

export const appendCodeEditorToBody = (editor: monaco.editor.ICodeEditor) => {
  const codeEditorService = StandaloneServices.get(ICodeEditorService);
  const allCodeEditors = codeEditorService.listCodeEditors();
  //@ts-ignore
  allCodeEditors.forEach((codeEditor) =>
    codeEditor.getContainerDomNode().remove()
  );
  document.body.append(editor.getContainerDomNode());
  editor.focus();

  //@ts-ignore
  window.editor = editor;
};
