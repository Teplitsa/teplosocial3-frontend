import { IncomingMessage, ServerResponse } from "http";
import { action, thunk } from "easy-peasy";
import * as _ from "lodash";
import {
  ICourseModel,
  ICourseState,
  ICourseActions,
  ICourseThunks,
} from "../model.typing";
import { learnPostInitialState } from "../base/learn-post-model";
import {
  requestModuleListByCourse,
  requestModuleListByCourseCompletedByAdaptest,
} from "./module-model";
import * as utils from "../../utilities/utilities";

export const courseState: ICourseState = {
  ..._.cloneDeep(learnPostInitialState),
  teaser: "",
  numberOfBlocks: 0,
  numberOfCompletedBlocks: 0,
  review: null,
  isAdaptestCompleted: false,
  adaptestSlug: "",
  moduleListByAdaptest: [],
  moduleListCompletedByAdaptest: [],
};

export const courseActions: ICourseActions = {
  initializeState: action((prevState) => {
    Object.assign(prevState, courseState);
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
  setReview: action((state, payload) => {
    state.review = payload;
  }),
  setModuleListByAdaptest: action((state, payload) => {
    state.moduleListByAdaptest = payload;
  }),
  setModuleListCompletedByAdaptest: action((state, payload) => {
    state.moduleListCompletedByAdaptest = payload;
  }),
  setIsAdaptestCompleted: action((state, payload) => {
    state.isAdaptestCompleted = payload;
  }),
};

export const courseThunks: ICourseThunks = {
  startCourseByUser: thunk(async (actions, { course, user, doneCallback }) => {
    let error = "";
    let data = [];

    try {
      let url = new URL(
        utils.getRestApiUrl(`/tps/v1/courses/${course.slug}/start`)
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
  submitCourseReview: thunk(
    async (actions, { course, user, courseReview, doneCallback }) => {
      let error = "";
      let data = [];

      // console.log("submit courseReview:", courseReview);

      try {
        const formData = new FormData();
        formData.append("mark", String(courseReview.rating));
        formData.append("comment", courseReview.text);
        formData.append("course_slug", course.slug);

        const response = await utils.tokenFetch(
          utils.getRestApiUrl(`/tps/v1/course-review/add`),
          {
            method: "post",
            body: formData,
          }
        );

        if (!response.ok) {
          ({ message: error } = await response.json());
        } else {
          data = await response.json();
          doneCallback({ ...data, review: courseReview });
          return;
        }
      } catch (error) {
        console.error(error);
        error = "Ошибка!";
      }

      doneCallback();
    }
  ),
  loadModuleListByCourseCompletedByAdaptest: thunk(
    async (actions, { course, doneCallback }) => {
      if (!course.slug) {
        console.error(
          "[TPS loadModuleListByCourseCompletedByAdaptest]: empty course slug"
        );
        return;
      }

      const { error, data } = await requestModuleListByCourse(course.slug);
      const { error: errorCompleted, data: dataCompleted } =
        await requestModuleListByCourseCompletedByAdaptest(course.slug);

      if (!error) {
        actions.setModuleListByAdaptest([...data]);
        actions.setModuleListCompletedByAdaptest([...dataCompleted]);
        actions.setIsAdaptestCompleted(true);
      } else {
        error && console.error(error);
        errorCompleted && console.error(errorCompleted);

        actions.setModuleListByAdaptest([]);
        actions.setModuleListCompletedByAdaptest([]);
      }

      if (doneCallback) {
        doneCallback();
      }
    }
  ),
};

export async function requestCourseListByTrack(slug, options = {}) {
  let error = "";
  let data = [];

  try {
    let url = new URL(utils.getRestApiUrl(`/tps/v1/courses/by-track/${slug}`));
    url.search = new URLSearchParams({
      per_page: String(100),
      orderby: "menu_order",
    }).toString();

    const response = await utils.tokenFetch(url, options);

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

export async function requestCourseList(
  params: {
    args?: Array<[string, string]>;
    fields?: Array<[string, string]>;
  } = { args: [], fields: [] }
) {
  let error = "";
  let data = [];

  try {
    const requestUrl = new URL(utils.getRestApiUrl(`/wp/v2/tps_course`));

    requestUrl.search = new URLSearchParams([
      ["per_page", "100"],
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

  // console.log("courses data:", data);
  return { error, data };
}

export async function requestCourseListCache({
  authToken,
  skip,
  limit,
  tagId,
  courseStatus,
}: {
  authToken?: string;
  skip?: number;
  limit?: number;
  tagId?: number;
  courseStatus?:
    | "completed"
    | "started"
    | Array<"completed" | "started">
    | "started,completed";
}) {
  const result = {
    error: "",
    data: null,
  };

  try {
    const requestUrl = new URL(`${process.env.BaseUrl}/api/v1/cache/courses`);
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

    if (typeof courseStatus === "string" || Array.isArray(courseStatus)) {
      const filterStatus = (
        Array.isArray(courseStatus) ? courseStatus : courseStatus.split(",")
      )
        .filter((status) => ["started", "completed"].includes(status))
        .map((status) => String(status));

      queryParams["filter[status]"] = filterStatus.join(",");
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

    const { courses, total } = await response.json();

    if (!courses) {
      result["error"] = "Кэш курсов пуст.";
    } else {
      result["data"] = { courses, total };
    }
  } catch (error) {
    console.error(error);
    result["error"] = "Во время отправки запроса на сервер произошла ошибка.";
  }

  return result;
}

export async function requestCourseTags(
  params: {
    args?: Array<[string, string]>;
    fields?: Array<[string, string]>;
  } = { args: [], fields: [] }
) {
  const result = {
    error: "",
    data: null,
  };

  try {
    const requestUrl = new URL(utils.getRestApiUrl(`/wp/v2/tags`));

    requestUrl.search = new URLSearchParams([
      ...params.args,
      ...params.fields,
    ]).toString();

    const response = await utils.tokenFetch(requestUrl);

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

export async function requestCourseTagsCache() {
  const result = {
    error: "",
    data: null,
  };

  try {
    const requestUrl = new URL(`${process.env.BaseUrl}/api/v1/cache/tags`);
    const response = await utils.tokenFetch(requestUrl);
    const { courseTags } = await response.json();

    if (!courseTags) {
      result["error"] = "Кэш тегов пуст.";
    } else {
      result["data"] = courseTags;
    }
  } catch (error) {
    console.error(error);
    result["error"] = "Во время отправки запроса на сервер произошла ошибка.";
  }

  return result;
}

export async function requestCourseWithFilter(params: {
  userId: number;
  filter?: "study" | "completed" | "all";
  fields?: Array<[string, string]>;
  req?: IncomingMessage & {
    cookies: any;
  };
  res?: ServerResponse;
}) {
  const result = {
    error: "",
    data: null,
  };

  try {
    const { userId, filter, fields, ...fetchOptions } = params;
    const requestUrl = new URL(
      utils.getRestApiUrl(
        `/tps/v1/courses/by-user/${userId}/filter/${filter ?? "all"}`
      )
    );

    requestUrl.search = new URLSearchParams(fields ?? null).toString();

    const response = await utils.tokenFetch(requestUrl, fetchOptions);

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

export async function requestCourseProgressCache({
  userId,
  authToken,
}: {
  userId: number;
  authToken: string;
}) {
  const result = {
    error: "",
    data: null,
  };

  try {
    const requestUrl = new URL(`${process.env.BaseUrl}/api/v1/cache/progress`);

    requestUrl.search = new URLSearchParams({
      "filter[user_id]": String(userId),
    }).toString();

    const response = await fetch(requestUrl.toString(), {
      headers: {
        "X-Auth-Token": authToken,
      },
    });
    const progress = await response.json();

    if (!progress.study && !progress.completed) {
      result["error"] = "Кэш прогресса обучения пуст.";
    } else {
      result["data"] = progress;
    }
  } catch (error) {
    console.error(error);
    result["error"] = "Во время отправки запроса на сервер произошла ошибка.";
  }

  return result;
}

export async function requestCourse(slug, options = {}) {
  let error = "";
  let data = {};

  try {
    let url = new URL(utils.getRestApiUrl(`/wp/v2/tps_course`));
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

  // console.log("data:", data);
  return { error, data: data as ICourseState };
}

const courseModel: ICourseModel = {
  ...courseState,
  ...courseActions,
  ...courseThunks,
};

export default courseModel;
