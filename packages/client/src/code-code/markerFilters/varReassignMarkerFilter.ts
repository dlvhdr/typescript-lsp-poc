import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

const varReassignCode = '2322';
const objectMissingPropsReassignCodes = ['2739', '2740'];

const FIX_SUGGESTION_COMMENT =
  'It’s recommended you use a new variable, such as "let newVar = ..." to make sure that all code completion work correctly.';
const WRONG_TYPE_ASSIGNMENT_WARNING = (
  type1: string | undefined,
  type2: string | undefined,
): string =>
  `You’re trying to assign an object of type '${type1}' to a variable that is declared as '${type2}'.`;

export default ({
  model,
  marker,
}: any): monaco.editor.IMarkerData => {
  if (model && model._languageId !== 'typescript') {
    return marker;
  }

  let customMessage = marker.message;

  if (marker.code === varReassignCode) {
    customMessage = `${marker.message}\n${FIX_SUGGESTION_COMMENT}`;
  }

  if (objectMissingPropsReassignCodes.includes(marker.code as string)) {
    const regex =
      /^Type '(.*?)' is missing the following properties from type '(.*?)': (.*)$/gm;
    const [, paramType1, paramType2] = regex.exec(marker.message) || [];
    customMessage = `${WRONG_TYPE_ASSIGNMENT_WARNING(
      paramType1,
      paramType2,
    )} ${FIX_SUGGESTION_COMMENT}`;
  }

  return Object.assign(marker, { message: customMessage });
};
