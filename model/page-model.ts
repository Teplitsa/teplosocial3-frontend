import { action, thunk } from "easy-peasy";
import * as _ from "lodash";
import {
  IPageModel,
  IPageState,
  IPageActions,
  IPageThunks,
  IStoreModel,
} from "./model.typing";
import { postInitialState } from "./base/post-model";
import { requestCourseTagsCache } from "./learn/course-model";
import * as utils from "../utilities/utilities";

export const pageState: IPageState = {
  ..._.cloneDeep(postInitialState),
  yoast_head_json: null,
  courseTags: [],
};

export const pageActions: IPageActions = {
  initializeState: action((prevState) => {
    Object.assign(prevState, pageState);
  }),
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState);
  }),
  setCourseTags: action((state, courseTags) => {
    state.courseTags = courseTags;
  }),
};

export const pageThunks: IPageThunks = {
  requestPage: thunk(async (actions, {}, { getStoreState }) => {
    const {
      components: {
        homePage: { slug },
      },
    } = getStoreState() as IStoreModel;

    const { error, data } = await requestPageComponentData(slug);
    if (!error) {
      actions.setState(data as IPageState);
    } else {
      console.error(error);
    }
  }),
};

export async function requestPageComponentData(slug) {
  let error = "";
  let data = {};

  try {
    // WAY1: from WP rest api

    let url = new URL(utils.getRestApiUrl(`/wp/v2/pages`));
    url.search = new URLSearchParams({ slug }).toString();

    const response = await utils.tokenFetch(url);

    if (!response.ok) {
      ({ message: error } = await response.json());
    } else {
      const responseData = await response.json();
      data = _.get(responseData, "0", {});
    }

    // WAY2: from mongo
    //   let url = new URL(`${process.env.BaseUrl}/api/v1/cache/pages/page`);
    //   url.search = new URLSearchParams({slug}).toString();
    //   const pageData = await utils.tokenFetch(url);
    //   // console.log("pageData:", pageData);

    //   if(pageData) {
    //     data = await pageData.json();
    //   }
  } catch (error) {
    console.error(error);
    error = "Ошибка!";
  }

  // console.log("data:", data);
  return { error, data };
}

export async function requestPageComponentDataCache({ slug, only_seo = "" }) {
  let error = "";
  let data = {};

  try {
    // WAY2: from mongo
    let url = new URL(`${process.env.BaseUrl}/api/v1/cache/pages/page`);
    url.search = new URLSearchParams({ slug, only_seo }).toString();
    const pageData = await utils.tokenFetch(url);
    // console.log("pageData:", pageData);

    if (pageData) {
      data = await pageData.json();
    }
  } catch (error) {
    console.error(error);
    error = "Ошибка!";
  }

  // console.log("data:", data);
  return { error, data };
}

export async function loadCourseTags(setCourseTags) {
  console.log("[PAGE MODEL] loadCourseTags...");

  const { error, data: tags } = await requestCourseTagsCache();

  if (!error) {
    setCourseTags(tags);
  } else {
    console.error(error);
  }
}

const pageModel: IPageModel = { ...pageState, ...pageActions, ...pageThunks };

export default pageModel;
