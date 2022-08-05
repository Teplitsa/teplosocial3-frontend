import { action } from "easy-peasy";
import {
  IAboutPageState,
  IAboutPageModel,
  IAboutPageActions,
  IAboutPageThunks,
} from "../../model.typing";
import { tokenFetch } from "../../../utilities/utilities";

const aboutPageState: IAboutPageState = {
  stats: null,
  tracks: null,
};

const aboutPageActions: IAboutPageActions = {
  initializeState: action((prevState) => {
    Object.assign(prevState, aboutPageState);
  }),
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState);
  }),
};

const aboutPageThunks: IAboutPageThunks = {};

const homePageModel: IAboutPageModel = {
  ...aboutPageState,
  ...aboutPageActions,
  ...aboutPageThunks,
};

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

export default homePageModel;
