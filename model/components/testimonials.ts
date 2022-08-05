import { action, thunk, thunkOn } from "easy-peasy";
import * as _ from "lodash";
import {
  ITestimonialsState,
  ITestimonialsModel,
  ITestimonialsActions,
  ITestimonialsThunks,
} from "../model.typing";
import * as utils from "../../utilities/utilities";

const testimonialsState: ITestimonialsState = {
  items: [],
};

const testimonialsActions: ITestimonialsActions = {
  initializeState: action((prevState) => {
    Object.assign(prevState, testimonialsState);
  }),
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState);
  }),
};

const testimonialsThunks: ITestimonialsThunks = {
  requestTestimonials: thunk(async (actions, _, { getStoreState }) => {
    const { error, data } = await requestTestimonialsComponentData();
    if (!error) {
      actions.setState({ items: data });
    } else {
      console.error(error);
    }
  }),
};

export async function requestTestimonialsComponentData(
  params: {
    args?: Array<[string, string]>;
    fields?: Array<[string, string]>;
  } = { args: [], fields: [] }
) {
  let error = "";
  let data = [];

  try {
    const requestUrl = new URL(utils.getRestApiUrl(`/wp/v2/substance`));

    requestUrl.search = new URLSearchParams([
      ["per_page", "100"],
      ["filter[substance_type]", "testimonials"],
      ...params.args,
      ...params.fields,
    ]).toString();

    const response = await utils.tokenFetch(requestUrl);

    if (!response.ok) {
      ({ message: error } = await response.json());
    } else {
      data = await response.json();
    }
  } catch (error) {
    console.error(error);
    error = "Ошибка!";
  }

  // console.log("data:", data);
  return { error, data };
}

export async function requestTestimonialsCache() {
  const result = {
    error: "",
    data: null,
  };

  try {
    const requestUrl = new URL(
      `${process.env.BaseUrl}/api/v1/cache/testimonials`
    );
    const response = await utils.tokenFetch(requestUrl);
    const { testimonials } = await response.json();

    if (!testimonials) {
      result["error"] = "Кэш отзывов пуст.";
    } else {
      result["data"] = testimonials;
    }
  } catch (error) {
    console.error(error);
    result["error"] = "Во время отправки запроса на сервер произошла ошибка.";
  }

  return result;
}

const testimonialsModel: ITestimonialsModel = {
  ...testimonialsState,
  ...testimonialsActions,
  ...testimonialsThunks,
};

export default testimonialsModel;
