import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { createModel, createTab } from "./models";
// @ts-ignore
import { ImmortalReference } from "monaco-editor/esm/vs/base/common/lifecycle";
// @ts-ignore
import { StandaloneCodeEditorService } from "monaco-editor/esm/vs/editor/standalone/browser/standaloneCodeEditorService.js";

StandaloneCodeEditorService.prototype.findModel = function (
  editor: monaco.editor.IStandaloneCodeEditor,
  resource: monaco.Uri
) {
  var model = null;
  if (resource !== null) model = monaco.editor.getModel(resource);
  if (model == null) {
    model = editor.getModel();
  }
  return model;
};

StandaloneCodeEditorService.prototype.doOpenEditor = function (
  editor: monaco.editor.IStandaloneCodeEditor,
  input: any
) {
  var model = this.findModel(editor, input.resource);
  if (!model) {
    return null;
  }
  editor.setModel(model);
  createTab(editor, model);
  var selection = input.options ? input.options.selection : null;
  if (selection) {
    if (
      typeof selection.endLineNumber === "number" &&
      typeof selection.endColumn === "number"
    ) {
      editor.setSelection(selection);
      editor.revealRangeInCenter(selection, 1 /* Immediate */);
    } else {
      var pos = {
        lineNumber: selection.startLineNumber,
        column: selection.startColumn,
      };
      editor.setPosition(pos);
      editor.revealPositionInCenter(pos, 1 /* Immediate */);
    }
  }
  return editor;
};

export class TextModelService {
  readonly _serviceBrand = undefined;

  async createModelReference(resource: monaco.Uri) {
    console.log("[DEBUG] createModelReference?", resource);
    const model = await this.getModel(resource);
    console.log("[DEBUG] created model", model);

    return new ImmortalReference({ textEditorModel: model });
  }

  /**
   * Registers a specific `scheme` content provider.
   */
  registerTextModelContentProvider(scheme: string, provider: any) {
    console.log("[DEBUG] registerTextModelContentProvider?", scheme, provider);
    return { dispose: function () {} };
  }

  /**
   * Check if the given resource can be resolved to a text model.
   */
  canHandleResource(resource: monaco.Uri): boolean {
    console.log("[DEBUG] canHandleResource?", resource);
    return true;
  }

  async getModel(uri: monaco.Uri): Promise<monaco.editor.ITextModel> {
    var model = monaco.editor.getModel(uri);
    if (!model) {
      return createModel(uri);
    }

    return model;
  }
}
