import { ReactElement, useEffect } from "react";
import { GetServerSideProps } from "next";
import * as _ from "lodash";

import DocumentHead from "../../components/DocumentHead";
import Main from "../../components/layout/Main";
import Track from "../../components/page/Track";
import * as courseModel from "../../model/learn/course-model";
import * as trackModel from "../../model/learn/track-model";

const TrackPage: React.FunctionComponent = (): ReactElement => {

  return (
    <>
      <DocumentHead />
      <Main>
        <main role="main">
          <Track />
        </main>
      </Main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res, params: { slug } }) => {
  const {error, data: track} = await trackModel.requestTrack(slug, {req, res});
  // console.log("track data:", track);

  const {error: courseListError, data: courseList} = await courseModel.requestCourseListByTrack(slug, {req, res});
  // console.log("courseList data:", courseList);

  const model = {
    app: {},
    page: track,
    trackPage: {
      track,
      courseList,
    }
  };

  return {
    props: {...model},
  };
};

export default TrackPage;
