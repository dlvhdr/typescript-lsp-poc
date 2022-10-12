import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import {THEME_COLORS, THEME_NAME, THEME_RULES} from "./consts"
monaco.editor.defineTheme(THEME_NAME, {
    base: 'vs',
    inherit: false,
    colors: THEME_COLORS,
    //@ts-ignore
    rules: THEME_RULES,
  });