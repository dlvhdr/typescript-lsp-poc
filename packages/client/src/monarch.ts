export const CUSTOM_WIX_CODE_TOKENS = {
  FUNCTION_NAME: 'function.name',
  FUNCTION_PARAMETER: 'function.parameter',
  RETURN_STATEMENT: 'return.statement',
  FUNCTION_CALL: 'function.call',
};

/* eslint-disable no-useless-escape */
// monacoMonarchTokensProvider was copied from: /monaco-languages/release/dev/javascript/javascript.js
const monacoMonarchTokensProvider = {
  // Set defaultToken to invalid to see what you do not tokenize yet
  defaultToken: 'invalid',
  tokenPostfix: '.ts',
  keywords: [
    'break',
    'case',
    'catch',
    'class',
    'continue',
    'const',
    'constructor',
    'debugger',
    'default',
    'delete',
    'do',
    'else',
    'export',
    'extends',
    'false',
    'finally',
    'for',
    'from',
    'function',
    'get',
    'if',
    'import',
    'in',
    'instanceof',
    'let',
    'new',
    'null',
    'return',
    'set',
    'super',
    'switch',
    'symbol',
    'this',
    'throw',
    'true',
    'try',
    'typeof',
    'undefined',
    'var',
    'void',
    'while',
    'with',
    'yield',
    'async',
    'await',
    'of',
  ],
  operators: [
    '<=',
    '>=',
    '==',
    '!=',
    '===',
    '!==',
    '=>',
    '+',
    '-',
    '**',
    '*',
    '/',
    '%',
    '++',
    '--',
    '<<',
    '</',
    '>>',
    '>>>',
    '&',
    '|',
    '^',
    '!',
    '~',
    '&&',
    '||',
    '??',
    '?',
    ':',
    '=',
    '+=',
    '-=',
    '*=',
    '**=',
    '/=',
    '%=',
    '<<=',
    '>>=',
    '>>>=',
    '&=',
    '|=',
    '^=',
    '@',
  ],
  // we include these common regular expressions
  symbols: /[=><!~?:&|+\-*\/\^%]+/,
  escapes:
    /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  digits: /\d+(_+\d+)*/,
  octaldigits: /[0-7]+(_+[0-7]+)*/,
  binarydigits: /[0-1]+(_+[0-1]+)*/,
  hexdigits: /[[0-9a-fA-F]+(_+[0-9a-fA-F]+)*/,
  regexpctl: /[(){}\[\]\$\^|\-*+?\.]/,
  regexpesc:
    /\\(?:[bBdDfnrstvwWn0\\\/]|@regexpctl|c[A-Z]|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4})/,
  // The main tokenizer for our languages
  tokenizer: {
    root: [[/[{}]/, 'delimiter.bracket'], { include: 'common' }],
    common: [
      // identifiers and keywords
      [
        /[a-z_$][\w$]*/,
        {
          cases: {
            '@keywords': 'keyword',
            '@default': 'identifier',
          },
        },
      ],
      [/[A-Z][\w\$]*/, 'type.identifier'],
      // [/[A-Z][\w\$]*/, 'identifier'],
      // whitespace
      { include: '@whitespace' },
      // regular expression: ensure it is terminated before beginning (otherwise it is an opeator)
      [
        /\/(?=([^\\\/]|\\.)+\/([gimsuy]*)(\s*)(\.|;|,|\)|\]|\}|$))/,
        { token: 'regexp', bracket: '@open', next: '@regexp' },
      ],
      // delimiters and operators
      [/[()\[\]]/, '@brackets'],
      [/[<>](?!@symbols)/, '@brackets'],
      [/!(?=([^=]|$))/, 'delimiter'],
      [
        /@symbols/,
        {
          cases: {
            '@operators': 'delimiter',
            '@default': '',
          },
        },
      ],
      // numbers
      [/(@digits)[eE]([\-+]?(@digits))?/, 'number.float'],
      [/(@digits)\.(@digits)([eE][\-+]?(@digits))?/, 'number.float'],
      [/0[xX](@hexdigits)n?/, 'number.hex'],
      [/0[oO]?(@octaldigits)n?/, 'number.octal'],
      [/0[bB](@binarydigits)n?/, 'number.binary'],
      [/(@digits)n?/, 'number'],
      // delimiter: after number because of .\d floats
      [/[;,.]/, 'delimiter'],
      // strings
      [/"([^"\\]|\\.)*$/, 'string.invalid'],
      [/'([^'\\]|\\.)*$/, 'string.invalid'],
      [/"/, 'string', '@string_double'],
      [/'/, 'string', '@string_single'],
      [/`/, 'string', '@string_backtick'],
    ],
    whitespace: [
      [/[ \t\r\n]+/, ''],
      [/\/\*\*(?!\/)/, 'comment.doc', '@jsdoc'],
      [/\/\*/, 'comment', '@comment'],
      [/\/\/.*$/, 'comment'],
    ],
    comment: [
      [/[^\/*]+/, 'comment'],
      [/\*\//, 'comment', '@pop'],
      [/[\/*]/, 'comment'],
    ],
    jsdoc: [
      [/[^\/*]+/, 'comment.doc'],
      [/\*\//, 'comment.doc', '@pop'],
      [/[\/*]/, 'comment.doc'],
    ],
    // We match regular expression quite precisely
    regexp: [
      [
        /(\{)(\d+(?:,\d*)?)(\})/,
        [
          'regexp.escape.control',
          'regexp.escape.control',
          'regexp.escape.control',
        ],
      ],
      [
        /(\[)(\^?)(?=(?:[^\]\\\/]|\\.)+)/,
        [
          'regexp.escape.control',
          { token: 'regexp.escape.control', next: '@regexrange' },
        ],
      ],
      [/(\()(\?:|\?=|\?!)/, ['regexp.escape.control', 'regexp.escape.control']],
      [/[()]/, 'regexp.escape.control'],
      [/@regexpctl/, 'regexp.escape.control'],
      [/[^\\\/]/, 'regexp'],
      [/@regexpesc/, 'regexp.escape'],
      [/\\\./, 'regexp.invalid'],
      [
        /(\/)([gimsuy]*)/,
        [{ token: 'regexp', bracket: '@close', next: '@pop' }, 'keyword.other'],
      ],
    ],
    regexrange: [
      [/-/, 'regexp.escape.control'],
      [/\^/, 'regexp.invalid'],
      [/@regexpesc/, 'regexp.escape'],
      [/[^\]]/, 'regexp'],
      [
        /\]/,
        {
          token: 'regexp.escape.control',
          next: '@pop',
          bracket: '@close',
        },
      ],
    ],
    string_double: [
      [/[^\\"]+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/"/, 'string', '@pop'],
    ],
    string_single: [
      [/[^\\']+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/'/, 'string', '@pop'],
    ],
    string_backtick: [
      [/\$\{/, { token: 'delimiter.bracket', next: '@bracketCounting' }],
      [/[^\\`$]+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/`/, 'string', '@pop'],
    ],
    bracketCounting: [
      [/\{/, 'delimiter.bracket', '@bracketCounting'],
      [/\}/, 'delimiter.bracket', '@pop'],
      { include: 'common' },
    ],
  },
};

const customTokensRules = {
  keywordsRegex: new RegExp(monacoMonarchTokensProvider.keywords.join('|')),
  word: /[a-zA-Z_$][\w$]*/,
  functionCallIdentifier: /([a-zA-Z_$][\w0-9_$]*)\s*(?=\()/,

  tokenizer: {
    root: [
      [/[{}]/, 'delimiter.bracket'],
      { include: 'CUSTOM' },
      { include: 'common' },
    ],
    // -- BEGIN custom tokens
    CUSTOM: [
      [/(return(?![\w$]))/, CUSTOM_WIX_CODE_TOKENS.RETURN_STATEMENT],
      [/(new)(?![\w$])/, { token: 'keyword', next: '@afterClassDecleration' }],
      [
        /(function(?![\w$]))/,
        { token: 'keyword', next: '@functionDeclaration' },
      ],
      [/(@keywordsRegex(?![\w$]))/, 'keyword'],
      [
        '@functionCallIdentifier',
        {
          token: CUSTOM_WIX_CODE_TOKENS.FUNCTION_CALL,
          next: '@functionCall',
        },
      ],
      [/[A-Z][\w$]*/, 'type.identifier'],
    ],
    // -- END custom tokens
    // -- BEGIN custom tokens - function declaration handling
    // After function
    functionDeclaration: [
      [/(@keywordsRegex(?![\w$]))/, 'keyword', '@pop'],
      [/\(/, { token: '@delimiter.parenthesis', next: '@functionParams' }],
      [
        /[a-zA-Z_$][\w$]*/,
        {
          token: CUSTOM_WIX_CODE_TOKENS.FUNCTION_NAME,
          next: '@afterFunctionDeclarationName',
        },
      ],
      [/\*/, 'keyword'],
      [/\)/, { token: 'delimiter.parenthesis', next: '@pop' }],
      { include: '@common' },
    ],
    // -- BEGIN custom tokens - after function decleration name
    afterFunctionDeclarationName: [
      [/\(/, { token: '@delimiter.parenthesis', next: '@functionParams' }],
      [/\)/, { token: '@rematch', next: '@pop' }],
      { include: '@common' },
    ],
    // -- END custom tokens - after function decleration name
    // -- BEGIN custom tokens - function call handling
    functionCall: [
      [/\)/, { token: 'delimiter.parenthesis', next: '@pop' }],
      [
        /\(/,
        {
          token: 'delimiter.parenthesis',
          next: '@functionParams',
        },
      ],
      { include: '@common' },
    ],
    // -- END custom tokens - function call handling
    // -- BEGIN custom tokens - anonymous function handling
    anonymousFunction: [
      [/\)/, { token: 'delimiter.parenthehgjgsis', next: '@pop' }],
      [/./, { token: '@rematch', next: '@functionParams' }],
      { include: '@common' },
    ],
    // -- END custom tokens - anonymous function handling
    functionParams: [
      [/[,{}.\[\]=]/, 'delimiter'],
      [/(@keywordsRegex(?![\w$]))/, 'keyword'], // handling nonsense code tokens
      [
        /([\w_$]+)(?=\()/,
        {
          token: CUSTOM_WIX_CODE_TOKENS.FUNCTION_CALL,
          next: '@functionCall',
        },
      ],
      [/[a-zA-Z_$][\w$]*(?!\()/, CUSTOM_WIX_CODE_TOKENS.FUNCTION_PARAMETER],
      [
        /\(/,
        {
          token: 'delimiter.parenthesis',
          next: '@anonymousFunction',
        },
      ],
      [/\)/, { token: '@rematch', next: '@pop' }],
      { include: '@common' },
    ],
    // -- END custom tokens - function declaration handling
    // -- BEGIN custom tokens - class declaration handling
    afterClassDecleration: [
      [/(@keywordsRegex(?![\w$]))/, 'keyword', '@pop'],
      [/(@word)/, 'type.identifier', '@pop'],
      { include: '@common' },
    ],
    // this block overrides the original monarch bracketCounting block
    bracketCounting: [
      [/\{/, 'delimiter.bracket', '@bracketCounting'],
      [/\}/, 'delimiter.bracket', '@pop'],
      { include: 'root' },
    ],
    // -- END custom tokens - class declaration handling
  },
};
declare type CustomMonarchLanguage =
  | typeof monacoMonarchTokensProvider
  | typeof customTokensRules;

const mergedMonarchTokensProvider: CustomMonarchLanguage = {
  ...monacoMonarchTokensProvider,
  ...customTokensRules,
  tokenizer: {
    ...monacoMonarchTokensProvider.tokenizer,
    ...customTokensRules.tokenizer,
  },
};
export default mergedMonarchTokensProvider;
/* eslint-enable no-useless-escape */
