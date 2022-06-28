import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { MonacoServices } from "monaco-languageclient";

export const createModel = async (
  uri: monaco.Uri
): Promise<monaco.editor.ITextModel> => {
  const rootUri = MonacoServices.get().workspace.rootUri;
  
  // const rootUri = "file://users/kobin/dev/typescript-lsp-poc/statics/";
  if (!rootUri) {
    throw new Error("No root Uri");
  }
  if(monaco.editor) {
    const existingModel = monaco.editor.getModel(uri);
    if (existingModel !== null) {
      return existingModel;
    }
  }
  

  const relativeUri = uri.toString().replace(rootUri, "");
  const url = `http://localhost:3001/${relativeUri}`;
  console.log(`[DEBUG] fetching ${url}`);
  const fileContents = await fetch(url, {
    method: "GET",
    mode: "cors",
  })
    .then(async (res) => {
      const text = await res.text();
      console.log("[DEBUG] Fetched file", { text });
      return text;
    })
    .catch((e) => console.error("wow error", e));

  const newModel = monaco.editor.createModel(fileContents!, undefined, uri);
  // editor.setModel(newModel);
  const tabs = window.document.querySelector(".tabs");
  const node = window.document.createElement("div");
  node.textContent = relativeUri;
  // node.onclick = () => {
  //   editor.setModel(newModel);
  // };
  tabs!.appendChild(node);
  return newModel;
};
