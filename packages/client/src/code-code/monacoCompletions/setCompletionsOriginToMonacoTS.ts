import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import {
  CompletionsFunc,
  WixCodeCustomCompletionItem,
} from './completionsManager';
import { ORIGINS } from './consts';

type ExtraLibCompletion = monaco.languages.CompletionItem & { uri: string };

const addOptionalOriginForMonacoTS = (
  completion: WixCodeCustomCompletionItem,
) => {
  if ((completion as ExtraLibCompletion).uri) {
    completion.origin = ORIGINS.LOCAL_OR_ECMA;
  }
};

const setCompletionsOriginToMonacoTS: CompletionsFunc = ({ completions }) => {
  completions.forEach(addOptionalOriginForMonacoTS);

  return completions;
};

export { setCompletionsOriginToMonacoTS };
