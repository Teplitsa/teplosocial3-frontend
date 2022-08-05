import * as _ from "lodash";
import * as store from "store";
import * as C from "../../const";

export function isBlockCompletedByGuest(block, module) {
  const existingModulesPassingState = store.get(C.TEPLO_LOCAL_STORAGE.MODULE_PASSING_STATE.name);
  // console.log("existingModulesPassingState:", existingModulesPassingState);
  // console.log("block.id:", block.id);

  return _.get(existingModulesPassingState, module.id, []).findIndex(blockId => blockId === block.id) > -1;
}

export function getModulesPassingState() {
  return store.get(C.TEPLO_LOCAL_STORAGE.MODULE_PASSING_STATE.name);
}

export function deleteModulesPassingState() {
  store.remove(C.TEPLO_LOCAL_STORAGE.MODULE_PASSING_STATE.name);
}
