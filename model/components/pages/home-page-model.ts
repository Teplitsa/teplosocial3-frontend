import { action } from "easy-peasy";
import {
  IHomePageState,
  IHomePageModel,
  IHomePageActions,
  IHomePageThunks,
} from "../../model.typing";
import { pageState, pageThunks } from "../../page-model";
import { getRestApiUrl, tokenFetch } from "../../../utilities/utilities";

const homePageState: IHomePageState = {
  ...pageState,
  advantages: null,
  courseFilter: {
    tags: [],
  },
  courses: null,
  courseTotal: 0,
  tracks: null,
  trackTotal: 0,
  stats: null,
  testimonials: null,
};

const homePageActions: IHomePageActions = {
  initializeState: action((prevState) => {
    Object.assign(prevState, homePageState);
  }),
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState);
  }),
  setCourseList: action((prevState, courseList) => {
    prevState.courses = courseList;
  }),
  setTrackList: action((prevState, trackList) => {
    prevState.tracks = trackList;
  }),
};

const homePageThunks: IHomePageThunks = {
  ...pageThunks,
};

const homePageModel: IHomePageModel = {
  ...homePageState,
  ...homePageActions,
  ...homePageThunks,
};

export async function requestStats() {
  const result = {
    error: "",
    data: null,
  };

  try {
    const requestUrl = new URL(getRestApiUrl(`/tps/v1/stats`));
    const response = await tokenFetch(requestUrl);

    if (!response.ok) {
      const { message } = await response.json();

      result["error"] = message;
    } else {
      result["data"] = await response.json();
    }
  } catch (error) {
    console.error(error);
    result["error"] = "Во время отправки запроса на сервер произошла ошибка.";
  }

  return result;
}

export async function requestStatsCache() {
  const result = {
    error: "",
    data: null,
  };

  try {
    const requestUrl = new URL(`${process.env.BaseUrl}/api/v1/cache/stats`);
    const response = await tokenFetch(requestUrl);
    const { stats } = await response.json();

    if (!stats) {
      result["error"] = "Кэш статистики пуст.";
    } else {
      result["data"] = stats;
    }
  } catch (error) {
    console.error(error);
    result["error"] = "Во время отправки запроса на сервер произошла ошибка.";
  }

  return result;
}

export async function requestAdvantages() {
  const result = {
    error: "",
    data: null,
  };

  try {
    const requestUrl = new URL(getRestApiUrl(`/wp/v2/substance`));

    requestUrl.search = new URLSearchParams([
      ["filter[substance_type]", "advantages"],
      ...["id", "featured_media", "title", "excerpt"].map((param) => [
        "_fields[]",
        param,
      ]),
    ]).toString();

    const response = await tokenFetch(requestUrl);

    if (!response.ok) {
      const { message } = await response.json();

      result["error"] = message;
    } else {
      result["data"] = await response.json();
    }
  } catch (error) {
    console.error(error);
    result["error"] = "Во время отправки запроса на сервер произошла ошибка.";
  }

  return result;
}

export async function requestAdvantagesCache() {
  const result = {
    error: "",
    data: null,
  };

  try {
    const requestUrl = new URL(
      `${process.env.BaseUrl}/api/v1/cache/advantages`
    );
    const response = await tokenFetch(requestUrl);
    const { advantages } = await response.json();

    if (!advantages) {
      result["error"] = "Кэш преимуществ пуст.";
    } else {
      result["data"] = advantages;
    }
  } catch (error) {
    console.error(error);
    result["error"] = "Во время отправки запроса на сервер произошла ошибка.";
  }

  return result;
}

export default homePageModel;
