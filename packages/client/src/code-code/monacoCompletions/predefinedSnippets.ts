import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import {
  CompletionsFunc,
  CompletionsParams,
  WixCodeCustomCompletionItem,
} from './completionsManager';
import { jsSnippets, Snippet } from './consts';
import { COMPLETION_TYPE_ORDER, ORIGINS, typeGetters } from './consts';

const completionSnippetMapper = (snippet: Snippet) => {
  const { description, body, prefix } = snippet;

  return {
    label: { label: prefix, detail: typeGetters.getSnippetType() },
    documentation: description,
    insertText: body.join('\n'),
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertTextRules:
      monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    sortText: COMPLETION_TYPE_ORDER.PREDEFINED_SNIPPETS,
    origin: ORIGINS.TEMPLATES,
  };
};

const isCompletionsForObjectProperty = ({
  model,
  position,
}: Omit<CompletionsParams, 'completions'>) => {
  const currentWordResult = model.getWordUntilPosition(position);
  if (currentWordResult.startColumn === 1) {
    return false;
  }

  const letterBeforeWordRange = {
    startLineNumber: position.lineNumber,
    endLineNumber: position.lineNumber,
    startColumn: currentWordResult.startColumn - 1,
    endColumn: currentWordResult.startColumn,
  };
  const letterBeforeWord = model.getValueInRange(letterBeforeWordRange);

  return letterBeforeWord === '.';
};

const addPredefinedSnippets: CompletionsFunc = ({ position, model }) => {
  if (isCompletionsForObjectProperty({ position, model })) {
    return [];
  }


  const snippetsCompletions: WixCodeCustomCompletionItem[] = Object.values(
    jsSnippets,
  ).map(completionSnippetMapper);

  return snippetsCompletions;
};

export { addPredefinedSnippets };
