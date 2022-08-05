import { action, computed, thunk, thunkOn } from "easy-peasy";
import * as _ from "lodash";
import {
  IBlockPageState,
  IBlockPageActions,
  IBlockPageThunks,
  IBlockPageModel,
} from "../../model.typing";

import blockModel, { requestSiblingListByBlock } from "../../learn/block-model";
import courseModel from "../../learn/course-model";
import moduleModel from "../../learn/module-model";
import quizModel from "../../learn/quiz-model";
import { requestModuleListByCourse } from "../../learn/module-model";

const blockPageState: IBlockPageState = {
  block: blockModel,
  module: moduleModel,
  course: courseModel,
  quiz: quizModel,
  siblingBlockList: null,
  courseModuleList: null,
  isCourseIndexOpen: false,
}

const blockPageActions: IBlockPageActions = {
  initializeState: action((prevState) => {
    Object.assign(prevState, blockPageState);
  }),
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState);
  }),
  setIsCourseIndexOpen: action((state, payload) => {
    state.isCourseIndexOpen = payload;
  }),
  setSiblingBlockList: action((state, payload) => {
    state.siblingBlockList = payload;
  }),
  setCourseModuleList: action((state, payload) => {
    state.courseModuleList = payload;
  }),
};

const blockPageThunks: IBlockPageThunks = {
  requestCourseModules: thunk(
    async (actions, course) => {
        const {error, data} = await requestModuleListByCourse(course.slug);

        if(!error) {
          actions.setCourseModuleList(data);
        } else {
          console.error("requestModuleListByCourse error:", error);
          actions.setCourseModuleList([]);
        }
    }
  ),  
  requestBlockSiblings: thunk(
    async (actions, block) => {
        const {error, data} = await requestSiblingListByBlock(block.slug);

        if(!error) {
          actions.setSiblingBlockList(data);
        } else {
          console.error("requestSiblingListByBlock error:", error);
          actions.setSiblingBlockList([]);
        }
    }
  ),  
};

const blockPageModel: IBlockPageModel = {
  ...blockPageState,
  ...blockPageActions,
  ...blockPageThunks,
};

export default blockPageModel;
