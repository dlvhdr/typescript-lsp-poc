import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import _ from 'lodash';
import {
  CompletionsFunc,
  WixCodeCustomCompletionItem,
} from './completionsManager';
import {
  labelGetters,
  typeGetters,
  docGetters,
  COMPLETION_TYPE_ORDER,
  ORIGINS,
} from './consts';
const pageElementsMap = {
  "button1": "$w.Button",
  "checkbox": "$w.Checkbox"
}
const getComponentCompletions = () => {
  const wixCodeCompCompletions = _.map(pageElementsMap, (type, id) => {
    const wixCodeSelectorById = labelGetters.getWixSelectorLabelByid(id);
    return {
      label: {
        label: wixCodeSelectorById,
        detail: `  ${type}`,
      },
      insertText: wixCodeSelectorById,
      documentation: {
        value: docGetters.getWixCodeSelectorByIdDoc(id, type),
      },
      kind: monaco.languages.CompletionItemKind.Function,
      sortText: COMPLETION_TYPE_ORDER.WIX_CODE_ID_SELECTOR,
      origin: ORIGINS.WIXSDK,
    };
  });

  return wixCodeCompCompletions;
};

const enrichWixCodeSelectorCompletion = (
  completions: WixCodeCustomCompletionItem[],
) => {
  let isWixCodeSelectorPresent = false;
  const wixCodeSelectorLabel = labelGetters.getWixSelectorLabel();

  const wixCodeCompletionMapper = (completion: WixCodeCustomCompletionItem) => {
    if (completion.label === wixCodeSelectorLabel) {
      completion.label = {
        label: wixCodeSelectorLabel,
        detail: `  ${typeGetters.getWixCodeSelectorType()}`,
      };
      completion.documentation = docGetters.getWixCodeSelectorDoc();
      completion.sortText = COMPLETION_TYPE_ORDER.WIX_CODE_SELECTOR;
      isWixCodeSelectorPresent = true;
      completion.origin = ORIGINS.WIXSDK;
    }

    return completion;
  };

  const modifiedCompletions = completions.map(wixCodeCompletionMapper);

  return { modifiedCompletions, isWixCodeSelectorPresent };
};

const addwixCodeSelectorCompletions: CompletionsFunc = ({ completions }) => {
  const { modifiedCompletions, isWixCodeSelectorPresent } =
    enrichWixCodeSelectorCompletion(completions);

    // @ts-ignore
  if (isWixCodeSelectorPresent && window.getFileContext() === "page") {
    const wixCodeCompCompletions = getComponentCompletions();
    // @ts-ignore
    completions = modifiedCompletions.concat(wixCodeCompCompletions);
  }

  return completions;
};

export { addwixCodeSelectorCompletions };
