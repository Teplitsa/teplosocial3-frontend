import { action, thunk, thunkOn } from "easy-peasy";
import * as _ from "lodash";
import {
  ICoursePageState,
  ICoursePageActions,
  ICoursePageThunks,
  ICoursePageModel,
} from "../../model.typing";

import courseModel from "../../learn/course-model";
import {requestBlockListByModule} from "../../learn/block-model";

const coursePageState: ICoursePageState = {
  course: courseModel,
  moduleList: [],
  moduleListBlockList: {},
}

const coursePageActions: ICoursePageActions = {
  initializeState: action((prevState) => {
    Object.assign(prevState, coursePageState);
  }),
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState);
  }),
  setModuleBlockList: action((state, {moduleId, blockList}) => {
    state.moduleListBlockList = {
      ...state.moduleListBlockList,
      [moduleId]: blockList,
    }
  }),
};

const coursePageThunks: ICoursePageThunks = {
  loadBlockListByModule: thunk(async (actions, { moduleId, doneCallback }) => {
    const {error, data: blockList} = await requestBlockListByModule(moduleId);
    actions.setModuleBlockList({moduleId, blockList});
    if(doneCallback) {
      doneCallback(moduleId);
    }
  }),
};

const coursePageModel: ICoursePageModel = {
  ...coursePageState,
  ...coursePageActions,
  ...coursePageThunks,
};

export default coursePageModel;
