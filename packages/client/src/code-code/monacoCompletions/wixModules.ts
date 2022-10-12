import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { labelGetters, COMPLETION_TYPE_ORDER, ORIGINS, WIX_MODULES } from './consts';
import {
  CompletionsFunc,
  WixCodeCustomCompletionItem,
} from './completionsManager';

let wixModulesImportStatements: string[] = [];

export function initWixModulesCompletions(modules: string[]) {
  wixModulesImportStatements = modules.map(module =>
    labelGetters.getWixModuleImportStatement(module),
  );
}

const getWixModules = (): WixCodeCustomCompletionItem[] => {
  const wixModulesCompletions = wixModulesImportStatements.map(
    moduleImportStatement => {
      return {
        label: { label: moduleImportStatement },
        documentation: moduleImportStatement,
        insertText: moduleImportStatement,
        kind: monaco.languages.CompletionItemKind.Variable,
        insertTextRules:
          monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        sortText: COMPLETION_TYPE_ORDER.IMPORT_TYPE,
        origin: ORIGINS.WIX_APIS,
      };
    },
  );

  return wixModulesCompletions;
};
export const setModulesCompletions = async () => {
	// @ts-ignore
	const context: "page" | "backend" | "public" = window.getFileContext();
    initWixModulesCompletions(WIX_MODULES[context]);
  };

const filterModulesByStartsWithLineValue =
  (lineValue: string) => (moduleCompletion: WixCodeCustomCompletionItem) =>
    (moduleCompletion.label as monaco.languages.CompletionItemLabel).label
      .toLowerCase()
      .startsWith(lineValue);

const modifyModuleRange =
  (range: Partial<monaco.Range>) =>
  (moduleCompletion: WixCodeCustomCompletionItem) =>
    ({
      ...moduleCompletion,
      range: { ...range, endColumn: moduleCompletion.insertText.length },
    } as WixCodeCustomCompletionItem);

const addWixModulesCompletions: CompletionsFunc = ({ position, model }) => {
  const range = {
    startLineNumber: position.lineNumber,
    endLineNumber: position.lineNumber,
    startColumn: 0,
    endColumn: position.column,
  };
  const lineValue = model?.getValueInRange(range).toLowerCase() as string;
  const wixModulesCompletions = getWixModules()
    .filter(filterModulesByStartsWithLineValue(lineValue))
    .map(modifyModuleRange(range));

  return wixModulesCompletions;
};

export { addWixModulesCompletions };
