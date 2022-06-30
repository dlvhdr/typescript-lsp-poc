import _ from 'lodash';

export const WIX_CODE_SELECTOR = "$w"

export const COMPLETION_TYPE_ORDER = {
  IMPORT_TYPE: '1',
  WIX_CODE_SELECTOR: '2',
  WIX_CODE_ID_SELECTOR: '3',
  PREDEFINED_SNIPPETS: '4',
};

export const ORIGINS = {
  LOCAL: 'local',
  WIXSDK: 'wixsdk',
  WIX_APIS: 'Wix APIs',
  ECMASCRIPT: 'ecmascript',
  TEMPLATES: 'Templates',
  LOCAL_OR_ECMA: 'localOrEcma',
};

export const labelGetters = {
  getWixSelectorLabel: () => WIX_CODE_SELECTOR,
  getWixSelectorLabelByid: (id: string) => `${WIX_CODE_SELECTOR}('#${id}')`,
  getWixModuleImportStatement: (module: string) => {
    const moduleName = _.camelCase(module);
    const label = `import ${moduleName} from '${module}';`;
    return label;
  },
};

export const docGetters = {
  getWixCodeSelectorDoc: () => 'Selects and returns elements from a page.',
  getWixCodeSelectorByIdDoc: (id: string, type: string) =>
    `Selects ${id}, a ${type}`,
};

export const typeGetters = {
  getWixCodeSelectorType: () => 'any',
  getSnippetType: () => 'snippet',
};
/** Snippets */
export interface Snippet {
  prefix: string;
  body: string[];
  description: string;
}
export interface JSSnippetList {
  [name: string]: Snippet;
}
export const jsSnippets: JSSnippetList = {
  'define module': {
    prefix: 'define',
    body: [
      'define([',
      "\t'require',",
      "\t'${1:dependency}'",
      '], function(require, ${2:factory}) {',
      "\t'use strict';",
      '\t$0',
      '});',
    ],
    description: 'define module',
  },
  'For Loop': {
    prefix: 'for',
    body: [
      'for (let ${1:index} = 0; ${1:index} < ${2:array}.length; ${1:index}++) {',
      '\tconst ${3:element} = ${2:array}[${1:index}];',
      '\t$0',
      '}',
    ],
    description: 'For Loop',
  },
  'For-Each Loop': {
    prefix: 'foreach',
    body: ['${1:array}.forEach(${2:element} => {', '\t$0', '});'],
    description: 'For-Each Loop',
  },
  'For-In Loop': {
    prefix: 'forin',
    body: [
      'for (const ${1:key} in ${2:object}) {',
      '\tif (${2:object}.hasOwnProperty(${1:key})) {',
      '\t\tconst ${3:element} = ${2:object}[${1:key}];',
      '\t\t$0',
      '\t}',
      '}',
    ],
    description: 'For-In Loop',
  },
  'For-Of Loop': {
    prefix: 'forof',
    body: ['for (const ${1:iterator} of ${2:object}) {', '\t$0', '}'],
    description: 'For-Of Loop',
  },
  'Function Statement': {
    prefix: 'function',
    body: ['function ${1:name}(${2:params}) {', '\t$0', '}'],
    description: 'Function Statement',
  },
  'If Statement': {
    prefix: 'if-statement',
    body: ['if (${1:condition}) {', '\t$0', '}'],
    description: 'If Statement',
  },
  'If-Else Statement': {
    prefix: 'ifelse',
    body: ['if (${1:condition}) {', '\t$0', '} else {', '\t', '}'],
    description: 'If-Else Statement',
  },
  'New Statement': {
    prefix: 'new',
    body: ['const ${1:name} = new ${2:type}(${3:arguments});$0'],
    description: 'New Statement',
  },
  'Switch Statement': {
    prefix: 'switch',
    body: [
      'switch (${1:key}) {',
      '\tcase ${2:value}:',
      '\t\t$0',
      '\t\tbreak;',
      '',
      '\tdefault:',
      '\t\tbreak;',
      '}',
    ],
    description: 'Switch Statement',
  },
  'While Statement': {
    prefix: 'while',
    body: ['while (${1:condition}) {', '\t$0', '}'],
    description: 'While Statement',
  },
  'Do-While Statement': {
    prefix: 'dowhile',
    body: ['do {', '\t$0', '} while (${1:condition});'],
    description: 'Do-While Statement',
  },
  'Try-Catch Statement': {
    prefix: 'trycatch',
    body: ['try {', '\t$0', '} catch (${1:error}) {', '\t', '}'],
    description: 'Try-Catch Statement',
  },
  'Set Timeout Function': {
    prefix: 'settimeout',
    body: ['setTimeout(() => {', '\t$0', '}, ${1:timeout});'],
    description: 'Set Timeout Function',
  },
  'Set Interval Function': {
    prefix: 'setinterval',
    body: ['setInterval(() => {', '\t$0', '}, ${1:interval});'],
    description: 'Set Interval Function',
  },
  'Import external module.': {
    prefix: 'import',
    body: ['import { $0 } from "${1:module}";'],
    description: 'Import external module.',
  },
  'Region Start': {
    prefix: '#region',
    body: ['//#region $0'],
    description: 'Folding Region Start',
  },
  'Region End': {
    prefix: '#endregion',
    body: ['//#endregion'],
    description: 'Folding Region End',
  },
  'Log to the console': {
    prefix: 'log',
    body: ['console.log($0);'],
    description: 'Log to the console',
  },
  'Log warning to console': {
    prefix: 'warn',
    body: ['console.warn($0);'],
    description: 'Log warning to the console',
  },
  'Log error to console': {
    prefix: 'error',
    body: ['console.error($0);'],
    description: 'Log error to the console',
  },
};


export const WIX_MODULES = {
	"page": [
		"wix-animations",
		"wix-bookings",
		"wix-chat-backend",
		"wix-crm",
		"wix-data",
		"wix-dataset",
		"wix-events",
		"wix-fetch",
		"wix-forum-backend",
		"wix-http-functions",
		"wix-location",
		"wix-marketing-backend",
		"wix-members",
		"wix-paid-plans",
		"wix-pay",
		"wix-pay-backend",
		"wix-realtime",
		"wix-router",
		"wix-search",
		"wix-secrets-backend",
		"wix-seo",
		"wix-site",
		"wix-site-backend",
		"wix-storage",
		"wix-stores",
		"wix-stores-backend",
		"wix-users",
		"wix-window"
	],
	"backend": [
		"wix-alarm-backend",
		"wix-animations",
		"wix-billing-backend",
		"wix-bookings-backend",
		"wix-captcha-backend",
		"wix-chat-backend",
		"wix-configs-backend",
		"wix-crm-backend",
		"wix-data",
		"wix-events-backend",
		"wix-fetch",
		"wix-forum-backend",
		"wix-groups-backend",
		"wix-http-functions",
		"wix-loyalty-backend",
		"wix-marketing-backend",
		"wix-media-backend",
		"wix-members-backend",
		"wix-paid-plans-backend",
		"wix-pay-backend",
		"wix-pricing-plans-backend",
		"wix-realtime",
		"wix-realtime-backend",
		"wix-router",
		"wix-search",
		"wix-secrets-backend",
		"wix-seo",
		"wix-site-backend",
		"wix-stores-backend",
		"wix-users-backend"
	],
	"public": [
		"wix-alarm-backend",
		"wix-animations",
		"wix-billing-backend",
		"wix-bookings",
		"wix-bookings-backend",
		"wix-captcha-backend",
		"wix-chat-backend",
		"wix-configs-backend",
		"wix-crm",
		"wix-crm-backend",
		"wix-data",
		"wix-dataset",
		"wix-events",
		"wix-events-backend",
		"wix-fetch",
		"wix-forum-backend",
		"wix-groups-backend",
		"wix-http-functions",
		"wix-location",
		"wix-loyalty-backend",
		"wix-marketing-backend",
		"wix-media-backend",
		"wix-members",
		"wix-members-backend",
		"wix-paid-plans",
		"wix-paid-plans-backend",
		"wix-pay",
		"wix-pay-backend",
		"wix-pricing-plans-backend",
		"wix-realtime",
		"wix-realtime-backend",
		"wix-router",
		"wix-search",
		"wix-secrets-backend",
		"wix-seo",
		"wix-site",
		"wix-site-backend",
		"wix-storage",
		"wix-stores",
		"wix-stores-backend",
		"wix-users",
		"wix-users-backend",
		"wix-window"
	]
}