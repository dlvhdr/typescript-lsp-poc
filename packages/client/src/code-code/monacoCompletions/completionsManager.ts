import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { addwixCodeSelectorCompletions } from './wixCodeSelectorCompletions';
import { addPredefinedSnippets } from './predefinedSnippets';
import { addWixModulesCompletions } from './wixModules';
import { setCompletionsOriginToMonacoTS } from './setCompletionsOriginToMonacoTS';

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

type CompletionItemWithOptionalRange = Optional<
  monaco.languages.CompletionItem,
  'range'
>;

export interface WixCodeCustomCompletionItem
  extends CompletionItemWithOptionalRange {
  origin?: string;
}

export interface CompletionsParams {
  completions: WixCodeCustomCompletionItem[];
  position: monaco.Position;
  model: monaco.editor.ITextModel;
}

export type CompletionsFunc = (
  completionsParams: CompletionsParams,
) => WixCodeCustomCompletionItem[];

enum CompletionFuncKind {
  MODIFY,
  ADD,
}

interface SortableCompletionFunc {
  completionFunc: CompletionsFunc;
  sortNumber: number;
  kind: CompletionFuncKind;
}

interface CompletionsFuncObj {
  addFunctions?: SortableCompletionFunc[];
  modifyFunctions?: SortableCompletionFunc[];
}

const completionsManagerCreator = () => {
  const patchCompletionsFunctions: CompletionsFuncObj = {
    addFunctions: [
      {
        completionFunc: addPredefinedSnippets,
        sortNumber: 2,
        kind: CompletionFuncKind.ADD,
      },
      {
        completionFunc: addWixModulesCompletions,
        sortNumber: 3,
        kind: CompletionFuncKind.ADD,
      },
    ],
    modifyFunctions: [
      {
        completionFunc: setCompletionsOriginToMonacoTS,
        sortNumber: 0,
        kind: CompletionFuncKind.MODIFY,
      },
      {
        completionFunc: addwixCodeSelectorCompletions,
        sortNumber: 1,
        kind: CompletionFuncKind.MODIFY,
      },
    ],
  };

  const getCompletionsByCompletionsFunctions = (
    completionsParams: CompletionsParams,
    completionsFunctionsObj: CompletionsFuncObj,
  ) => {
    const addFunctions = completionsFunctionsObj.addFunctions || [];
    const modifyFunctions = completionsFunctionsObj.modifyFunctions || [];

    const sortCompletionFunctions = (
      firstFunction: SortableCompletionFunc,
      secondFunction: SortableCompletionFunc,
    ) =>  firstFunction.sortNumber - secondFunction.sortNumber;

    const executeCompletionsFunctions = (
      completionFuncObj: SortableCompletionFunc,
    ) => {
      console.log("completionFuncObj", completionFuncObj)
      const completions = completionFuncObj.completionFunc(completionsParams);
      if (completionFuncObj.kind === CompletionFuncKind.ADD) {
        completionsParams.completions =
          completionsParams.completions.concat(completions);
      } else {
        completionsParams.completions = completions;
      }
    };
    [...addFunctions, ...modifyFunctions]
      .sort(sortCompletionFunctions)
      .forEach(executeCompletionsFunctions);

    return completionsParams.completions;
  };

  const patchCompletions = (completionsParams: CompletionsParams) =>
    getCompletionsByCompletionsFunctions(
      completionsParams,
      patchCompletionsFunctions,
    );

  return {
    patchCompletions,
  };
};

export const completionsManager = completionsManagerCreator();
