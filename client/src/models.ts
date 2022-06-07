import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { MonacoServices } from "monaco-languageclient";

export const createModel = async (
  editor: monaco.editor.IStandaloneCodeEditor,
  relativeUri: string
) => {
  const rootUri = MonacoServices.get().workspace.rootUri;
  const fullUri = `${rootUri}${relativeUri}`;
  console.log(`[DEBUG] createModel ${fullUri}`);
  const monacoUri = monaco.Uri.parse(fullUri);
  if (monaco.editor.getModel(monacoUri) !== null) {
    return;
  }

  const url = `http://localhost:3000/${relativeUri}`;
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

  const newModel = monaco.editor.createModel(
    fileContents!,
    undefined,
    monacoUri
  );
  // editor.setModel(newModel);
  const tabs = window.document.querySelector(".tabs");
  const node = window.document.createElement("div");
  node.textContent = relativeUri;
  node.onclick = () => {
    editor.setModel(newModel);
  };
  tabs!.appendChild(node);
  return newModel;
};
