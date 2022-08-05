import { action, computed, thunk, thunkOn } from "easy-peasy";
import * as _ from "lodash";
import {
  IProfileEditPageState,
  IProfileEditPageActions,
  IProfileEditPageThunks,
  IProfileEditPageModel,
} from "../../model.typing";

import profileModel from "../../member/profile-model";

const profileEditPageState: IProfileEditPageState = {
  profile: profileModel,
}

const profileEditPageActions: IProfileEditPageActions = {
  initializeState: action((prevState) => {
    Object.assign(prevState, profileEditPageState);
  }),
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState);
  }),
};

const profileEditPageThunks: IProfileEditPageThunks = {
};

const profileEditPageModel: IProfileEditPageModel = {
  ...profileEditPageState,
  ...profileEditPageActions,
  ...profileEditPageThunks,
};

export default profileEditPageModel;
