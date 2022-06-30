import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { DEFAULT_LANGUAGE } from './consts';
import {
  CompletionsFunc,
  completionsManager,
} from './monacoCompletions/completionsManager';

interface ProvideCompletionItemsPatchParams {
  provider: monaco.languages.CompletionItemProvider;
  completionsFunc: CompletionsFunc;
  languageId: monaco.languages.LanguageSelector;
}

const provideCompletionItemsPatch = ({
  provider,
  completionsFunc,
  languageId,
}: ProvideCompletionItemsPatchParams) => {
  // @ts-ignore
  if (languageId[0] !== DEFAULT_LANGUAGE) {
    return;
  }

  const _provideCompletionsItems = provider.provideCompletionItems;
  provider.provideCompletionItems = async (model, position, ...args) => {
    const completionsList: monaco.languages.CompletionList =
      (await _provideCompletionsItems.apply(provider, [
        model,
        position,
        ...args,
      ])) || { suggestions: [] };

    completionsList.suggestions = completionsFunc({
      completions: completionsList.suggestions,
      model,
      position,
    }) as unknown as monaco.languages.CompletionItem[];

    return completionsList;
  };
};

const registerCompletionItemProviderPatch = (
  completionsFunc: CompletionsFunc,
) => {
  const _registerCompletionItemProvider =
    monaco.languages.registerCompletionItemProvider;
  monaco.languages.registerCompletionItemProvider = (languageId, provider) => {
    provideCompletionItemsPatch({
      provider,
      completionsFunc,
      languageId,
    });

    return _registerCompletionItemProvider(languageId, provider);
  };
};

const applyRegisterCompletionItemProviderPatch = () => {
  registerCompletionItemProviderPatch(completionsManager.patchCompletions);
};

applyRegisterCompletionItemProviderPatch();
