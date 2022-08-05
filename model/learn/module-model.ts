import { action, thunk } from "easy-peasy";
import * as _ from "lodash";
import { IModuleModel, IModuleState, IModuleActions, IModuleThunks, IStoreModel } from "../model.typing";
import { learnPostInitialState } from "../base/learn-post-model";
import * as utils from "../../utilities/utilities";

export const moduleState: IModuleState = {
  ..._.cloneDeep(learnPostInitialState),
  numberOfBlocks: 0,
  numberOfCompletedBlocks: 0,
  courseSlug: "",
  isCompletedByAdaptest: false,
};

export const moduleActions: IModuleActions = {
  initializeState: action((prevState) => {
    Object.assign(prevState, moduleState);
  }),
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState);
  }),
  setIsStarted: action((state, isStarted) => {
    state.isStarted = isStarted
  }),
  setIsCompleted: action((state, isCompleted) => {
    state.isCompleted = isCompleted
  }),
};

export const moduleThunks: IModuleThunks = {
};

export async function requestModuleListByCourse(slug, options={}) {
  let error = "";
  let data = [];

  try {
    let url = new URL(utils.getRestApiUrl(`/tps/v1/modules/by-course/${slug}`));
    url.search = new URLSearchParams({
      per_page: String(100),
      orderby: "menu_order",
    }).toString();    

    const response = await utils.tokenFetch(url, options);

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

export async function requestModuleListByCourseCompletedByAdaptest(slug, options={}) {
  let error = "";
  let data = [];

  try {
    let url = new URL(utils.getRestApiUrl(`/tps/v1/modules/by-course/${slug}/completed-by-adaptest`));
    url.search = new URLSearchParams({
      per_page: String(100),
      orderby: "menu_order",
    }).toString();    

    const response = await utils.tokenFetch(url, options);

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

export async function requestModule(slug, options={}) {
  let error = "";
  let data = {};

  try {
    let url = new URL(utils.getRestApiUrl(`/wp/v2/sfwd-courses`));
    url.search = new URLSearchParams({"slug[]": slug}).toString();

    const response = await utils.tokenFetch(url, options);

    if(!response.ok) {
      ({ message: error } = await response.json());
    } else {
      const responseData = await response.json();
      data = _.get(responseData, "0", {});
    }
  } catch (error) {
    console.error(error);
    error = "Ошибка!";
  }

  // console.log("data:", data);
  return {error, data};
}

const moduleModel: IModuleModel = { ...moduleState, ...moduleActions, ...moduleThunks };

export default moduleModel;
