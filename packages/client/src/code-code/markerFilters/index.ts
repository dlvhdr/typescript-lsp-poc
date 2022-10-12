import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import $wMarkerFilter from './$wSelectorsAndWrongParamAssignMarkerFilter';
import varReassignMarkerFilter from './varReassignMarkerFilter';

const markersFilters =  [$wMarkerFilter, varReassignMarkerFilter];

const originalSetMarkers = monaco.editor.setModelMarkers;

monaco.editor.setModelMarkers = function patchSetModelMarkers(
  model,
  owner,
  markers,
) {
    //@ts-ignore
  if (model && model._languageId !== 'typescript') {
    return originalSetMarkers(model, owner, markers);
  }
  let filteredMarkers: monaco.editor.IMarkerData[] = [];
  try {
    filteredMarkers = markers.filter(marker =>
        markersFilters.every(filter => filter({ model, owner, marker })),
    );
  } catch (e) {
    // falling silently
    // eslint-disable-next-line no-console
    console.error(e);
  }
  return originalSetMarkers(model, owner, filteredMarkers);
};
