import { IncomingMessage, ServerResponse } from "http";
import { action, thunk } from "easy-peasy";
import {
  IDashboardPageState,
  IDashboardPageModel,
  IDashboardPageActions,
  IDashboardPageThunks,
  IStoreModel,
} from "../../model.typing";
import { getRestApiUrl, tokenFetch } from "../../../utilities/utilities";
import { COURSES_PER_PAGE } from "../../../const";

const dashboardPageState: IDashboardPageState = {
  startedCourses: null,
  certificates: null,
  courseTags: null,
  completedCourseFilter: {
    searchPhrase: "",
    searchTooltips: {
      courses: null,
    },
  },
  completedCourses: null,
  completedCourseTotal: 0,
  completedCourseSkip: 0,
  isCompletedCourseListLoading: false,
};

const dashboardPageActions: IDashboardPageActions = {
  initializeState: action((prevState) => {
    Object.assign(prevState, dashboardPageState);
  }),
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState);
  }),
  setCompletedCourseList: action((prevState, courseList) => {
    prevState.completedCourses = courseList;
  }),
  updateCompletedCourseList: action((prevState, courseList) => {
    prevState.completedCourses = [
      ...(prevState.completedCourses ?? []),
      ...courseList,
    ];
  }),
  setSearchPhrase: action((prevState, newSearchPhrase) => {
    prevState.completedCourseFilter.searchPhrase = newSearchPhrase;
  }),
  setCompletedCourseTotal: action((prevState, courseTotal) => {
    prevState.completedCourseTotal = courseTotal;
  }),
  setCompletedCourseSkip: action((prevState, courseSkip) => {
    prevState.completedCourseSkip = courseSkip;
  }),
  setCompletedCourseListLoading: action((prevState, isLoading) => {
    prevState.isCompletedCourseListLoading = isLoading;
  }),
  setSearchTooltipsForCourse: action((prevState, newCourseTooltips) => {
    prevState.completedCourseFilter.searchTooltips.courses = newCourseTooltips;
  }),
};

const dashboardPageThunks: IDashboardPageThunks = {
  completedCourseListRequest: thunk(
    async (
      {
        setCompletedCourseList,
        updateCompletedCourseList,
        setCompletedCourseTotal,
      },
      { callback },
      { getStoreState }
    ) => {
      const {
        session: {
          token: { authToken },
        },
        components: {
          dashboardPage: {
            completedCourseFilter: { searchPhrase },
            completedCourseSkip,
          },
        },
      } = getStoreState() as IStoreModel;

      try {
        const requestUrl = new URL(
          `${process.env.BaseUrl}/api/v1/cache/courses`
        );

        const courseListArgs = {
          limit: String(COURSES_PER_PAGE),
          skip: String(completedCourseSkip),
          "filter[status]": "completed",
        };

        if (searchPhrase.length > 0) {
          courseListArgs["s"] = searchPhrase;
        }

        requestUrl.search = new URLSearchParams(courseListArgs).toString();

        const response = await fetch(requestUrl.toString(), {
          headers: {
            "X-Auth-Token": String(authToken),
          },
        });
        const { courses, total } = await response.json();

        if (completedCourseSkip) {
          updateCompletedCourseList(courses ?? []);
        } else {
          setCompletedCourseList(courses ?? []);
        }

        setCompletedCourseTotal(total);

        callback && callback();
      } catch (error) {
        console.error(error);
      }
    }
  ),
  completedCourseTooltipsRequest: thunk(
    async ({ setSearchTooltipsForCourse }, payload, { getStoreState }) => {
      const {
        session: {
          token: { authToken },
        },
        components: {
          dashboardPage: {
            completedCourseFilter: { searchPhrase },
          },
        },
      } = getStoreState() as IStoreModel;

      if (searchPhrase.length === 0) {
        setSearchTooltipsForCourse(null);

        return;
      }

      try {
        const requestUrl = new URL(
          `${process.env.BaseUrl}/api/v1/cache/courses`
        );

        const courseListArgs = {
          limit: String(COURSES_PER_PAGE),
          s: searchPhrase,
          search_mode: "exact",
          "filter[status]": "completed",
        };

        requestUrl.search = new URLSearchParams(courseListArgs).toString();

        const response = await fetch(requestUrl.toString(), {
          headers: {
            "X-Auth-Token": String(authToken),
          },
        });
        const { courses } = await response.json();

        setSearchTooltipsForCourse(courses);
      } catch (error) {
        console.error(error);
      }
    }
  ),
};

const dashboardPageModel: IDashboardPageModel = {
  ...dashboardPageState,
  ...dashboardPageActions,
  ...dashboardPageThunks,
};

export async function requestCertificates(params: {
  userId: number;
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
    const { userId, ...fetchOptions } = params;
    const requestUrl = new URL(
      getRestApiUrl(`/tps/v1/certificate/by-user/${userId}`)
    );
    const response = await tokenFetch(requestUrl, fetchOptions);

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

export async function requestCertificatesCache({
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
    const requestUrl = new URL(
      `${process.env.BaseUrl}/api/v1/cache/certificates`
    );

    requestUrl.search = new URLSearchParams({
      "filter[user_id]": String(userId),
    }).toString();

    const response = await fetch(requestUrl.toString(), {
      headers: {
        "X-Auth-Token": authToken,
      },
    });
    const { certificates } = await response.json();

    if (!certificates) {
      result["error"] = "Кэш сертификатов пуст.";
    } else {
      result["data"] = certificates;
    }
  } catch (error) {
    console.error(error);
    result["error"] = "Во время отправки запроса на сервер произошла ошибка.";
  }

  return result;
}

export default dashboardPageModel;
