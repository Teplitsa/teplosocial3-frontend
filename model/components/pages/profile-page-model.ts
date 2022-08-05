import { action, computed, thunk, thunkOn } from "easy-peasy";
import * as _ from "lodash";
import {
  IProfilePageState,
  IProfilePageActions,
  IProfilePageThunks,
  IProfilePageModel,
} from "../../model.typing";

import profileModel from "../../member/profile-model";

const profilePageState: IProfilePageState = {
  profile: profileModel,
}

const profilePageActions: IProfilePageActions = {
  initializeState: action((prevState) => {
    Object.assign(prevState, profilePageState);
  }),
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState);
  }),
};

const profilePageThunks: IProfilePageThunks = {
};

const profilePageModel: IProfilePageModel = {
  ...profilePageState,
  ...profilePageActions,
  ...profilePageThunks,
};

export default profilePageModel;
