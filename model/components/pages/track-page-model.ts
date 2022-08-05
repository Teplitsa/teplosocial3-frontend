import { action, thunk, thunkOn } from "easy-peasy";
import * as _ from "lodash";
import {
  ITrackPageState,
  ITrackPageActions,
  ITrackPageThunks,
  ITrackPageModel,
} from "../../model.typing";

import trackModel from "../../learn/track-model";
import { requestModuleListByCourse } from "../../learn/module-model";

const trackPageState: ITrackPageState = {
  track: trackModel,
  courseList: [],
  courseListModuleList: {},
}

const trackPageActions: ITrackPageActions = {
  initializeState: action((prevState) => {
    Object.assign(prevState, trackPageState);
  }),
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState);
  }),
  setCourseModuleList: action((prevState, {course, moduleList}) => {
    Object.assign(prevState, {
      courseListModuleList: {
        ...prevState.courseListModuleList, 
        [course.id]: moduleList
      }
    });
  }),
};

const trackPageThunks: ITrackPageThunks = {
  requestModuleListByCourse: thunk(
    async (actions, {course}, { getStoreState }) => {

      const {error, data: moduleList} = await requestModuleListByCourse(course.slug);
      // console.log("course:", course.slug, course.id);
      // console.log("moduleList:", moduleList);

      if(!error) {
        actions.setCourseModuleList({course, moduleList});
      }
      else {
        console.error(error);
      }
    }
  ),
};

const trackPageModel: ITrackPageModel = {
  ...trackPageState,
  ...trackPageActions,
  ...trackPageThunks,
};

export default trackPageModel;
