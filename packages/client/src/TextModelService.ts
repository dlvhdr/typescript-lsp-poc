import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { createModel } from "./models";

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

// export interface ITextModelService {
// 	readonly _serviceBrand: undefined;
//
// 	/**
// 	 * Provided a resource URI, it will return a model reference
// 	 * which should be disposed once not needed anymore.
// 	 */
// 	createModelReference(resource: URI): Promise<IReference<IResolvedTextEditorModel>>;
//
// 	/**
// 	 * Registers a specific `scheme` content provider.
// 	 */
// 	registerTextModelContentProvider(scheme: string, provider: ITextModelContentProvider): IDisposable;
//
// 	/**
// 	 * Check if the given resource can be resolved to a text model.
// 	 */
// 	canHandleResource(resource: URI): boolean;
// }

// function SomeTextModelService() {}
// SomeTextModelService.prototype = {
//   createModelReference: function (uri) {
//     return this.getModel(uri);
//   },
//   registerTextModelContentProvider: function () {
//     return { dispose: function () {} };
//   },
//   hasTextModelContentProvider: function (schema) {
//     return true;
//   },
//   _buildReference: function (model) {
//     var lifecycle = require("vs/base/common/lifecycle");
//     var ref = new lifecycle.ImmortalReference({ textEditorModel: model });
//     return {
//       object: ref.object,
//       dispose: function () {
//         ref.dispose();
//       },
//     };
//   },
//   getModel: function (uri) {
//     var _this = this;
//     return new Promise(function (r) {
//       var model = monaco.editor.getModel(uri);
//       if (!model) {
//         /* ajax.get('http://path/to/file').then(function (contents) { r(monaco.editor.createModel(contents, 'javascript', uri)); return; }) */
//       }
//       r(_this._buildReference(model));
//     });
//   },
// };
