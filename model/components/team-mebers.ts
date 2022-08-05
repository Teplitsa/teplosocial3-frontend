import { action, thunk, thunkOn } from "easy-peasy";
import * as _ from "lodash";
import {
  ITeamMembersState,
  ITeamMembersModel,
  ITeamMembersActions,
  ITeamMembersThunks,
} from "../model.typing";
import * as utils from "../../utilities/utilities";

const teamMembersState: ITeamMembersState = {
  items: [],
}

const teamMembersActions: ITeamMembersActions = {
  initializeState: action((prevState) => {
    Object.assign(prevState, teamMembersState);
  }),
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState);
  }),
};

const teamMembersThunks: ITeamMembersThunks = {
  requestTeamMembers: thunk(
    async (actions, _, { getStoreState }) => {

      const {error, data} = await requestTeamMembersComponentData();
      if(!error) {
        actions.setState({items: data});
      }
      else {
        console.error(error);
      }
    }
  ),
};

export async function requestTeamMembersComponentData() {
  let error = "";
  let data = [];

  try {
    let url = new URL(utils.getRestApiUrl(`/wp/v2/person`));
    url.search = new URLSearchParams({
      'filter[person_type]': 'komanda-teploseti',
    }).toString();

    const response = await utils.tokenFetch(url);

    if(!response.ok) {
      ({ message: error } = await response.json());
    } else {
      data = await response.json();
    }


  } catch (error) {
    console.error(error);
    error = "Ошибка!";
  }

  // console.log("data:", data);
  return {error, data};
}

const teamMembersModel: ITeamMembersModel = {...teamMembersState, ...teamMembersActions, ...teamMembersThunks,};

export default teamMembersModel;
