import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

export const createModel = async (
  uri: monaco.Uri
): Promise<monaco.editor.ITextModel> => {
  const existingModel = monaco.editor.getModel(uri);
  if (existingModel !== null) {
    return existingModel;
  }

  const url = `http://localhost:3001/${uri.fsPath}`;
  const fileContents = await fetch(url, {
    method: "GET",
    mode: "cors",
  })
    .then(async (res) => {
      const text = await res.text();
      return text;
    })
    .catch((e) => console.error(e));

  return monaco.editor.createModel(fileContents!, undefined, uri);
};

export const createTab = (
  editor: monaco.editor.IStandaloneCodeEditor,
  model: monaco.editor.ITextModel
) => {
  const uri = model.uri;
  const tabs = window.document.querySelector(".tabs");

  const existingTabs = Array.from(tabs?.querySelectorAll("div") ?? []).map(
    (tab) => tab.innerText
  );
  if (existingTabs.includes(uri.toString())) {
    return;
  }

  const node = window.document.createElement("div");
  node.textContent = uri.toString();
  node.onclick = () => {
    editor.setModel(model);
  };
  tabs!.appendChild(node);
};
