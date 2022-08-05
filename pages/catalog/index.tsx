import { ReactElement } from "react";
import { GetServerSideProps } from "next";

import DocumentHead from "../../components/DocumentHead";
import Main from "../../components/layout/Main";
import Catalog from "../../components/page/Catalog";

import { authorizeSessionSSRFromRequest } from "../../model/session-model";
import { requestTrackListCache } from "../../model/learn/track-model";
import {
  requestCourseListCache,
  requestCourseTagsCache,
} from "../../model/learn/course-model";
import { COURSES_PER_PAGE } from "../../const";

const CatalogPage: React.FunctionComponent = (): ReactElement => {
  return (
    <>
      <DocumentHead />
      <Main>
        <Catalog />
      </Main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const session = await authorizeSessionSSRFromRequest(req, res);
  const tagId = Number.isInteger(Number(query["filter[tag_id]"]))
    ? Number(query["filter[tag_id]"])
    : null;
  const { error: tagError, data: courseTags } = await requestCourseTagsCache();
  const { error: coursesError, data: courseData } =
    await requestCourseListCache({
      authToken: session.token.authToken,
      limit: COURSES_PER_PAGE,
      tagId,
    });
  const { error: tracksError, data: trackData } = await requestTrackListCache({
    authToken: session.token.authToken,
    limit: COURSES_PER_PAGE,
    tagId,
  });

  const model = {
    app: {},
    session,
    page: {
      title: { rendered: "Каталог курсов" },
    },
    catalogPage: {
      courseFilter: {
        searchPhrase: "",
        searchTooltips: {
          courses: null,
          tracks: null,
        },
        tags: courseTags,
        activeTags: tagId ? [tagId] : [],
      },
      courses: courseData?.courses ?? null,
      tracks: trackData?.tracks ?? null,
      courseTotal: courseData?.total ?? 0,
      courseSkip: 0,
      trackTotal: trackData?.total ?? 0,
      trackSkip: 0,
    },
  };

  return {
    props: { ...model },
  };
};

export default CatalogPage;
