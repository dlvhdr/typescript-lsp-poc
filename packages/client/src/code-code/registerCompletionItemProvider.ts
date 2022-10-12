import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { DEFAULT_LANGUAGE } from './consts';
import {
  CompletionsFunc,
  completionsManager,
} from './monacoCompletions/completionsManager';

interface ProvideCompletionItemsPatchParams {
  provider: monaco.languages.CompletionItemProvider;
  completionsFunc: CompletionsFunc;
  language: monaco.languages.LanguageSelector;
}

const provideCompletionItemsPatch = ({
  provider,
  completionsFunc,
  language,
}: ProvideCompletionItemsPatchParams) => {
  // @ts-ignore
  if (language[0]?.language !== DEFAULT_LANGUAGE) {
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
  monaco.languages.registerCompletionItemProvider = (language, provider) => {
    provideCompletionItemsPatch({
      provider,
      completionsFunc,
      language,
    });

    return _registerCompletionItemProvider(language, provider);
  };
};

const applyRegisterCompletionItemProviderPatch = () => {
  registerCompletionItemProviderPatch(completionsManager.patchCompletions);
};

applyRegisterCompletionItemProviderPatch();
