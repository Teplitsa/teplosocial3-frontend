import { action, thunk, thunkOn } from "easy-peasy";
import * as _ from "lodash";
import {
  ITeamPageState,
  ITeamPageModel,
  ITeamPageActions,
  ITeamPageThunks,
} from "../../model.typing";
import * as pageModel from "../../page-model";

const teamPageState: ITeamPageState = {
  ..._.cloneDeep(pageModel.pageState),
}

const teamPageActions: ITeamPageActions = {
  initializeState: action((prevState) => {
    Object.assign(prevState, teamPageState);
  }),
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState);
  }),
};

const teamPageThunks: ITeamPageThunks = _.cloneDeep(pageModel.pageThunks);

const teamPageModel: ITeamPageModel = {
  ...teamPageState,
  ...teamPageActions,
  ...teamPageThunks,
};

export default teamPageModel;
