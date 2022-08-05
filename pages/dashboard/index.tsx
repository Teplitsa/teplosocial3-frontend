import { ReactElement } from "react";
import { GetServerSideProps } from "next";

import { useStoreState } from "../../model/helpers/hooks";
import Error401 from "components/page/Error401";
import DocumentHead from "../../components/DocumentHead";
import Main from "../../components/layout/Main";
import DashBoard from "../../components/page/DashBoard";
import {
  requestCourseListCache,
  requestCourseTagsCache,
} from "../../model/learn/course-model";
import { requestCertificatesCache } from "../../model/components/pages/dashboard-page-model";
import { authorizeSessionSSRFromRequest } from "../../model/session-model";
import { COURSES_PER_PAGE } from "../../const";

const HomePage: React.FunctionComponent = (): ReactElement => {
  const isLoggedIn = useStoreState((state) => state.session.isLoggedIn);

  return (
    <>
      <DocumentHead />
      <Main>{isLoggedIn ? <DashBoard /> : <Error401 />}</Main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const isDev = process.env.NODE_ENV === "development";

  isDev && console.time("dashboardPageTotal");
  isDev && console.time("session");
  const session = await authorizeSessionSSRFromRequest(req, res);
  isDev && console.timeEnd("session");

  const model = {
    app: {},
    session,
    page: {
      slug: "dashboard",
      yoast_head_json: {
        canonical: "https://kurs.te-st.ru/dashboard",
        title: `Личный кабинет пользователя ${session.user.firstName} ${session.user.lastName} — Теплица.Курсы`,
        description: "",
        robots: {
          index: "noindex",
          follow: "nofollow",
        },
      },
    },
    dashboardPage: {
      courseFilter: {
        searchPhrase: "",
        searchTooltips: {
          courses: null,
        },
      },
    },
  };

  if (!session.user.id) {
    res.statusCode = 401;
  } else {
    isDev && console.time("certificates (mongo cache)");
    const { error: certificatesError, data: certificates } =
      await requestCertificatesCache({
        userId: session.user.id,
        authToken: session.token.authToken,
      });

    isDev && console.timeEnd("certificates (mongo cache)");

    isDev && console.time("courseList (mongo cache)");
    const {
      error: startedCoursesError,
      data: { courses: startedCourses },
    } = await requestCourseListCache({
      authToken: session.token.authToken,
      courseStatus: ["started"],
    });

    const {
      error: completedCoursesError,
      data: { courses: completedCourses, total: completedCourseTotal },
    } = await requestCourseListCache({
      authToken: session.token.authToken,
      limit: COURSES_PER_PAGE,
      courseStatus: ["completed"],
    });

    isDev && console.timeEnd("courseList (mongo cache)");

    Object.assign(model.dashboardPage, {
      certificates,
      startedCourses,
    });

    Object.assign(model.dashboardPage, {
      completedCourseTotal,
      completedCourses,
    });

    if (model.dashboardPage["startedCourses"].length === 0) {
      const { error: tagError, data: tagList } = await requestCourseTagsCache();

      model.dashboardPage["courseTags"] = tagList;
    }
  }

  isDev && console.timeEnd("dashboardPageTotal");

  return {
    props: { ...model },
  };
};

export default HomePage;
