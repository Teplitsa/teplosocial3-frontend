import { action, thunk } from "easy-peasy";
import * as _ from "lodash";
import {
  ITrackModel,
  ITrackState,
  ITrackActions,
  ITrackThunks,
} from "../model.typing";
import { learnPostInitialState } from "../base/learn-post-model";
import * as utils from "../../utilities/utilities";

export const trackState: ITrackState = {
  ..._.cloneDeep(learnPostInitialState),
  numberOfBlocks: 0,
  numberOfCompletedBlocks: 0,
};

export const trackActions: ITrackActions = {
  initializeState: action((prevState) => {
    Object.assign(prevState, trackState);
  }),
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState);
  }),
  setIsStarted: action((state, isStarted) => {
    state.isStarted = isStarted;
  }),
  setIsCompleted: action((state, isCompleted) => {
    state.isCompleted = isCompleted;
  }),
};

export const trackThunks: ITrackThunks = {
  startTrackByUser: thunk(async (actions, { track, user, doneCallback }) => {
    let error = "";
    let data = [];

    try {
      let url = new URL(
        utils.getRestApiUrl(`/tps/v1/tracks/${track.slug}/start`)
      );

      const response = await utils.tokenFetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_ids: [user.id],
        }),
      });

      if (!response.ok) {
        ({ message: error } = await response.json());
      } else {
        data = await response.json();
        actions.setIsStarted(true);
        doneCallback(data);
        return;
      }
    } catch (error) {
      console.error(error);
      error = "Ошибка!";
    }

    doneCallback();
  }),
};

export async function requestTrackList(
  params: {
    args?: Array<[string, string]>;
    fields?: Array<[string, string]>;
  } = {
    args: [
      ["per_page", "100"],
      ["orderby", "menu_order"],
    ],
    fields: [],
  }
) {
  let error = "";
  let data = [];

  try {
    const requestUrl = new URL(utils.getRestApiUrl(`/wp/v2/tps_track`));

    requestUrl.search = new URLSearchParams([
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

  return { error, data };
}

export async function requestTrackListCache({
  authToken,
  skip,
  limit,
  tagId,
}: {
  authToken?: string;
  skip?: number;
  limit?: number;
  tagId?: number;
}) {
  const result = {
    error: "",
    data: null,
  };

  try {
    const requestUrl = new URL(`${process.env.BaseUrl}/api/v1/cache/tracks`);
    const queryParams = {};

    if (typeof skip === "number") {
      queryParams["skip"] = String(skip);
    }

    if (typeof limit === "number") {
      queryParams["limit"] = String(limit);
    }

    if (typeof tagId === "number") {
      queryParams["filter[tag_id]"] = String(tagId);
    }

    requestUrl.search = new URLSearchParams(queryParams).toString();

    const response = await fetch(
      requestUrl.toString(),
      authToken
        ? {
            headers: {
              "X-Auth-Token": authToken,
            },
          }
        : {}
    );

    const { tracks, total } = await response.json();

    if (!tracks) {
      result["error"] = "Кэш треков пуст.";
    } else {
      result["data"] = { tracks, total };
    }
  } catch (error) {
    console.error(error);
    result["error"] = "Во время отправки запроса на сервер произошла ошибка.";
  }

  return result;
}

export async function requestTrack(slug, options = {}) {
  let error = "";
  let data = {};

  try {
    let url = new URL(utils.getRestApiUrl(`/wp/v2/tps_track`));
    url.search = new URLSearchParams({ slug }).toString();

    const response = await utils.tokenFetch(url, options);

    if (!response.ok) {
      ({ message: error } = await response.json());
    } else {
      const responseData = await response.json();
      data = _.get(responseData, "0", {});
    }
  } catch (error) {
    console.error(error);
    error = "Ошибка!";
  }

  return { error, data };
}

const trackModel: ITrackModel = {
  ...trackState,
  ...trackActions,
  ...trackThunks,
};

export default trackModel;
