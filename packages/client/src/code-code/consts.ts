import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
export const THEME_COLORS = {
  "editor.background": "#061b29",
  "editor.foreground": "#d8e1e8",
  "editorLineNumber.foreground": "#7a91a5",
  "editorLineNumber.activeForeground": "#d8e1e8",
  "editor.wordHighlightStrongBackground": "#253842",
  "editor.selectionBackground": "#004b85",
  "editor.inactiveSelectionBackground": "#253842",
  "editor.findMatchBackground": "#475158",
  "editor.findMatchHighlightBackground": "#53451f",
  "editor.lineHighlightBorder": "#0b2634",
  "editor.lineHighlightBackground": "#0b2634",
  "editorIndentGuide.background": "#1c3d4e",
  "editorIndentGuide.activeBackground": "#67728f",
  "editor.rangeHighlightBackground": "#0b2634",
  "editor.rangeHighlightBorder": "#0b2634",
  "editorCursor.foreground": "#d8e1e8",
  "editorCursor.background": "#d8e1e8",
  "menu.foreground": "#d8e1e8",
  "menu.background": "#162d3d",
  "menu.selectionForeground": "#d8e1e8",
  "menu.selectionBackground": "#2b80cb",
  focusBorder: "#2d4150",
  "input.background": "#0b2634",
  "input.foreground": "#d8e1e8",
  "input.border": "#2d4150",
  errorForeground: "#ee5951",
  "editorWidget.background": "#0b2634",
  "editorWidget.foreground": "#d8e1e8",
  "editorWidget.border": "#0b2634",
  "editorError.foreground": "#ee5951",
  "editorWarning.foreground": "#ffc133",
  "editorOverviewRuler.errorForeground": "#ee5951",
  "editorOverviewRuler.warningForeground": "#ffc133",
  "peekViewEditor.matchHighlightBackground": "#53451f",
  "peekViewResult.background": "#2d4150",
  "peekViewResult.lineForeground": "#d8e1e8",
  "peekViewResult.selectionForeground": "#d8e1e8",
  "list.hoverBackground": "#2d4150",
  "list.inactiveSelectionBackground": "#2d4150",
  "peekViewEditor.background": "#162d3d",
  "peekViewTitle.background": "#0e2e44",
  "peekViewTitleLabel.foreground": "#d8e1e8",
  "peekViewTitleDescription.foreground": "#d8e1e8",
  "editorLink.activeForeground": "#fff",
  "editorGutter.foldingControlForeground": "#d8e1e8",
  "editorSuggestWidget.background": "#1b2c3c",
  "editorSuggestWidget.foreground": "#d8e1e8",
  "editorSuggestWidget.border": "#2d4150",
  "editorSuggestWidget.selectedBackground": "#2b80cb",
  "editorSuggestWidget.focusHighlightForeground": "#fff",
  "editorSuggestWidget.highlightForeground": "#65b0f1",
};
export const THEME_RULES = [
  {
    background: {
      hashtag: "#061b29",
      value: "061b29",
    },
  },
  {
    token: "",
    foreground: "d8e1e8",
  },
  {
    token: "comment",
    foreground: "7a91a5",
  },
  {
    token: "string",
    foreground: "e986ae",
  },
  {
    token: "number",
    foreground: "f5926e",
  },
  {
    token: "keyword",
    foreground: "4eb7f4",
    fontStyle: "bold",
  },
  {
    token: "identifier",
    foreground: "aba8ff",
  },
  {
    token: "type.identifier",
    foreground: "42c5bf",
  },
  {
    token: "delimiter",
    foreground: "d8e1e8",
  },
  {
    token: "function.name",
    foreground: "c6c8a9",
  },
  {
    token: "function.parameter",
    foreground: "aba8ff",
  },
  {
    token: "function.call",
    foreground: "c6c8a9",
  },
  {
    token: "return.statement",
    foreground: "e1568e",
    fontStyle: "bold",
  },
];
export const THEME_NAME = "custom-theme";
export const EDITOR_OPTIONS = {
  parameterHints: {
    enabled: true,
  },
  quickSuggestions: { comments: false, strings: true },
  automaticLayout: true,
  glyphMargin: true,
  theme: THEME_NAME,
  fontSize: 16,
  contextmenu: true,
};
export const DEFAULT_LANGUAGE = "typescript";

export const LANG_CONF = {
  comments: {
    lineComment: "//",
    blockComment: ["/*", "*/"],
  },

  brackets: [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"],
  ],

  onEnterRules: [
    {
      // e.g. /** | */
      beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
      afterText: /^\s*\*\/$/,
      action: {
        indentAction: monaco.languages.IndentAction.IndentOutdent,
        appendText: " * ",
      },
    },
    {
      // e.g. /** ...|
      beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
      action: {
        indentAction: monaco.languages.IndentAction.None,
        appendText: " * ",
      },
    },
    {
      // e.g.  * ...|
      beforeText: /^(\t|(\ \ ))*\ \*(\ ([^\*]|\*(?!\/))*)?$/,
      action: {
        indentAction: monaco.languages.IndentAction.None,
        appendText: "* ",
      },
    },
    {
      // e.g.  */|
      beforeText: /^(\t|(\ \ ))*\ \*\/\s*$/,
      action: {
        indentAction: monaco.languages.IndentAction.None,
        removeText: 1,
      },
    },
  ],

  autoClosingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"', notIn: ["string"] },
    { open: "'", close: "'", notIn: ["string", "comment"] },
    { open: "`", close: "`", notIn: ["string", "comment"] },
    { open: "/**", close: " */", notIn: ["string"] },
  ],

  folding: {
    markers: {
      start: new RegExp("^\\s*//\\s*#?region\\b"),
      end: new RegExp("^\\s*//\\s*#?endregion\\b"),
    },
  },
};
