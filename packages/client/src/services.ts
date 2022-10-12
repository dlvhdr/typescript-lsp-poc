import { StandaloneServices } from "vscode/services";
import getModelEditorServiceOverride from "vscode/service-override/modelEditor";
import getMessageServiceOverride from "vscode/service-override/messages";
import getConfigurationServiceOverride, {
  configurationRegistry,
} from "vscode/service-override/configuration";
import { createConfiguredEditor } from "vscode/monaco";
import { EDITOR_OPTIONS } from "./code-code/consts";
import { setModulesCompletions } from "./code-code/monacoCompletions/wixModules";
import { appendCodeEditorToBody, createTab } from "./models";

export const initializeServices = () => {
  const modelEditorService = getModelEditorServiceOverride(async (model) => {
    const editorContainer = document.createElement("div");
    editorContainer.id = model.uri.path;
    editorContainer.style.height = "100vh";
    const editor = createConfiguredEditor(editorContainer, {
      ...EDITOR_OPTIONS,
      model,
    });
    editor.onDidChangeModel(async () => {
      setModulesCompletions();
    });
    appendCodeEditorToBody(editor);

    createTab(model.uri);

    return editor;
  });

  StandaloneServices.initialize({
    ...modelEditorService,
    ...getMessageServiceOverride(document.body),
    ...getConfigurationServiceOverride(),
  });

  configurationRegistry.registerDefaultConfigurations([
    {
      overrides: {
        "editor.fontSize": 16,
      },
    },
  ]);
};
