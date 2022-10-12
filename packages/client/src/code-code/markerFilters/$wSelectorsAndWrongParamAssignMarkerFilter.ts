import has_ from 'lodash/has';

const wrongParameterErrorCode = '2345';
const TYPESCRIPT_ERROR_MESSAGE_PREFIX = 'Argument of type';
const TYPESCRIPT_MESSAGE_BODY = 'is not assignable to parameter of type';
const TYPESCRIPT_$W_ELEMENT_SELECTOR_ALIAS = 'WixElementSelector';
const REGEX_CLASS_TYPE_PARAMATER =
  /Argument of type '"?([`a-zA-Z0-9$#_\\,\s{}[\]]+)"?'/;

const REGEX_WRONG_PARAM_ASSIGN =
  /^Argument of type '(.*?)' is not assignable to parameter of type '(.*?)'.$/;

const TEMPLATE_LITERALS_REGEX = /^`.*[^\\](\${.*}).*`$/;

const getClassTypeParameter = (msg: string): string | undefined => {
  const regex = new RegExp(REGEX_CLASS_TYPE_PARAMATER, 'g');
  const m = regex.exec(msg) || [];
  const [, typeParameter] = m;
  return typeParameter;
};

const shouldIgnoreWrongParamAssign = (msg: string): boolean => {
  const regex = new RegExp(REGEX_WRONG_PARAM_ASSIGN, 'gm');
  const [, actualType, expectedType] = regex.exec(msg) || [];
  return actualType === 'number' && expectedType === 'string';
};

const is$wMessage = (msg: string): boolean =>
  msg.includes(
    `${TYPESCRIPT_MESSAGE_BODY} '${TYPESCRIPT_$W_ELEMENT_SELECTOR_ALIAS}'`,
  );

// typescript resolve old string concatinations like => "#selector" + index to 'string'
const isArgumentOfTypeString = (msg: string): boolean =>
  msg.startsWith(
    `${TYPESCRIPT_ERROR_MESSAGE_PREFIX} 'string' ${TYPESCRIPT_MESSAGE_BODY}`,
  );

// typescript resolve templates literals like => `#selector${index}` to `#selector${string | number | any | ... }`
const isTemplateLiterals = (msg: string): boolean => {
  const typeParameter = getClassTypeParameter(msg);
  if (typeParameter && TEMPLATE_LITERALS_REGEX.test(typeParameter)) {
    return true;
  }
  return false;
};

const getDidYouForgetHashtagMessage = (classParameter: string): string =>
  `Did you forget the # symbol? '${classParameter}' is not a valid selector. To refer to an element in code, prefix the element’s ID with the hash symbol ‘#’ (e.g. '#${classParameter}').`;
const getNotAValidSelectorMessage = (classParameter: string): string =>
  `'${classParameter}' is not a valid selector. Capitalize the element type name without the hash symbol (#) (e.g. "Button") to select multiple elements.`;
const getUnknownIdMessage = (classParameter: string | undefined): string =>
  `An element with the ID '${classParameter}' does not exist on this page. Select another element and view or edit its ID in the Properties & Events panel.`;

const calcHelpfulMessage = (classParameter: string | undefined): string => {
  if (classParameter && !classParameter.startsWith("#")) {
    // @ts-ignore
    const context = window.getFileContext();
    if (has_(context.elementsMap, classParameter)) {
      return getDidYouForgetHashtagMessage(classParameter);
    } else {
      return getNotAValidSelectorMessage(classParameter);
    }
  }
  return getUnknownIdMessage(classParameter);
};

const isMultiSelector = (typeParameter: string | undefined): boolean =>
  !!typeParameter && typeParameter.includes(',');

export default ({ model, marker }: any): boolean => {
  if (model && model._languageId !== 'typescript' || marker.code !== wrongParameterErrorCode) {
    return true;
  }

  if (is$wMessage(marker.message)) {
    if (
      isArgumentOfTypeString(marker.message) ||
      isTemplateLiterals(marker.message)
    ) {
      return false;
    }
    const typeParameter = getClassTypeParameter(marker.message);
    if (isMultiSelector(typeParameter)) {
      return false;
    }
    marker.message = calcHelpfulMessage(typeParameter);
  } else if (shouldIgnoreWrongParamAssign(marker.message)) {
    return false;
  }
  return true;
};
