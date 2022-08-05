import { ReactElement } from "react";
import { GetServerSideProps } from "next";
import DocumentHead from "../components/DocumentHead";
import Main from "../components/layout/Main";
import Home from "../components/page/Home";
import { requestPageComponentDataCache } from "../model/page-model";
import { requestMediaData } from "../model/media-model";
import { requestTrackListCache } from "../model/learn/track-model";
import {
  requestCourseListCache,
  requestCourseTagsCache,
} from "../model/learn/course-model";
import { requestTestimonialsCache } from "../model/components/testimonials";
import {
  requestAdvantagesCache,
  requestStatsCache,
} from "../model/components/pages/home-page-model";
import { authorizeSessionSSRFromRequest } from "../model/session-model";
import { stripTags } from "../utilities/utilities";
import { IPageState } from "../model/model.typing";

const HomePage: React.FunctionComponent = (): ReactElement => {
  return (
    <>
      <DocumentHead />
      <Main>
        <Home />
      </Main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const isDev = process.env.NODE_ENV === "development";

  isDev && console.time("homePageTotal");
  isDev && console.time("session");
  const session = await authorizeSessionSSRFromRequest(req, res);
  isDev && console.timeEnd("session");

  isDev && console.time("pageDataWithSEO (mongo cache)");
  const { error: pageError, data: pageData } =
    await requestPageComponentDataCache({ slug: "glavnaya", only_seo: "true" });
  isDev && console.timeEnd("pageDataWithSEO (mongo cache)");

  isDev && console.time("pageMediaId");
  const pageMediaId = (pageData as IPageState).featured_media ?? 0;
  const { error: mediaError, data: media } = pageMediaId
    ? await requestMediaData(pageMediaId)
    : {
        error: "",
        data: null,
      };
  isDev && console.timeEnd("pageMediaId");

  const model = {
    app: {},
    session,
    page: {
      ...pageData,
      seo: {
        title: (pageData as IPageState)?.title?.rendered ?? "",
        metaDesc: stripTags((pageData as IPageState).content?.rendered ?? ""),
        focuskw: (pageData as IPageState)?.title?.rendered ?? "",
        opengraphImage: media
          ? {
              sourceUrl: (media as { source_url: string }).source_url ?? "",
              srcSet:
                (
                  (media as { description: { rendered: string } }).description
                    ?.rendered ?? ""
                )
                  .match(/srcset="(.*?)"/)
                  ?.slice(1, 2)
                  .shift() ?? "",
              altText: "",
            }
          : null,
      },
    },
    homePage: {
      ...pageData,
    },
  };

  isDev && console.time("advantages (mongo cache)");
  const { error: advantagesError, data: advantages } =
    await requestAdvantagesCache();
  isDev && console.timeEnd("advantages (mongo cache)");

  isDev && console.time("stats (mongo cache)");
  const { error: statsError, data: stats } = await requestStatsCache();
  isDev && console.timeEnd("stats (mongo cache)");

  isDev && console.time("testimonials (mongo cache)");
  const { error: testimonialsError, data: testimonials } =
    await requestTestimonialsCache();
  isDev && console.timeEnd("testimonials (mongo cache)");

  isDev && console.time("tags (mongo cache)");

  const { error: tagError, data: tagList } = await requestCourseTagsCache();

  isDev && console.timeEnd("tags (mongo cache)");

  isDev && console.time("courseList (mongo cache)");
  const {
    error: coursesError,
    data: { courses: courseList, total: courseTotal },
  } = await requestCourseListCache({
    authToken: session.token.authToken,
    limit: 3,
  });

  isDev && console.timeEnd("courseList (mongo cache)");

  isDev && console.time("trackList (mongo cache)");
  const {
    error: tracksError,
    data: { tracks: trackList, total: trackTotal },
  } = await requestTrackListCache({
    authToken: session.token.authToken,
    limit: 3,
  });
  isDev && console.timeEnd("trackList (mongo cache)");

  isDev && console.timeEnd("homePageTotal");

  Object.assign(model.homePage, {
    courseFilter: {
      tags: tagList,
    },
    stats,
    courses: courseList,
    courseTotal,
    tracks: trackList,
    trackTotal,
    advantages,
    testimonials,
  });

  return {
    props: { ...model },
  };
};

export default HomePage;
