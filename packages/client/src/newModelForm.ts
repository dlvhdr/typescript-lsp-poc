import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { ICodeEditorService, StandaloneServices } from "@codingame/monaco-vscode-api/services";
import { appendCodeEditorToBody } from "./models";

export const registerAddNewModelForm = () => {
  const codeEditorService = StandaloneServices.get(ICodeEditorService);
  const addFileDialog = document.querySelector(
    "#add-file-dialog"
  ) as HTMLDialogElement;
  document
    .querySelector<HTMLButtonElement>("#new-file")!
    .addEventListener("click", () => {
      addFileDialog.showModal();
    });

  document
    .querySelector<HTMLButtonElement>("#add-file-dialog-button")!
    .addEventListener("click", async () => {
      const fileName =
        document.querySelector<HTMLInputElement>("#file-name")!.value;
      const fileContent =
        document.querySelector<HTMLInputElement>("#file-content")!.value;
      const newModelUri = monaco.Uri.parse(`velo:${fileName}`);

      const newModel = monaco.editor.createModel(
        fileContent,
        undefined,
        newModelUri
      );

      let uriStr = newModelUri.toString();
      if (uriStr.includes(".jsw")) {
        const dTsUriStr = uriStr.replace(".jsw.ts", ".jsw.d.ts");
        monaco.editor.createModel(
          fileContent,
          undefined,
          monaco.Uri.parse(dTsUriStr)
        );
      }

      const editor = await codeEditorService.openCodeEditor(
        { resource: newModel.uri },
        null
      );
      if (!editor) {
        return;
      }
      appendCodeEditorToBody(editor);
      editor.focus();
      addFileDialog.close();
    });
};
