import * as _ from "lodash";

import { ILearnPostState } from "../model.typing";
import { postInitialState } from "./post-model";

export const learnPostInitialState: ILearnPostState = {
  ..._.cloneDeep(postInitialState),
  duration: 0,
  points: 0,
  isCompleted: false,
  isStarted: false,
};
