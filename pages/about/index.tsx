import { ReactElement } from "react";
import { GetServerSideProps } from "next";
import DocumentHead from "../../components/DocumentHead";
import Main from "../../components/layout/Main";
import About from "../../components/page/about/About";
import { requestTrackListCache } from "../../model/learn/track-model";
import { requestStatsCache } from "../../model/components/pages/about-page-model";

const AboutPage: React.FunctionComponent = (): ReactElement => {
  return (
    <>
      <DocumentHead />
      <Main>
        <About />
      </Main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const model = {
    app: {},
    page: {
      title: { rendered: "О проекте «Теплица.Курсы»" },
    },
    aboutPage: {},
  };

  const { error: statsError, data: stats } = await requestStatsCache();

  const {
    error: tracksError,
    data: { tracks: trackList },
  } = await requestTrackListCache({});

  Object.assign(model.aboutPage, {
    stats,
    tracks: trackList,
  });

  return {
    props: { ...model },
  };
};

export default AboutPage;
