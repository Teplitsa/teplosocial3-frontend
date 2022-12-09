import { ReactElement, useEffect } from "react";
import { GetServerSideProps } from "next";
import * as _ from "lodash";

import DocumentHead from "../../../components/DocumentHead";
import Main from "../../../components/layout/Main";
import ProfileEdit from "../../../components/page/member/ProfileEdit";
import * as profileModel from "../../../model/member/profile-model";
import { authorizeSessionSSRFromRequest } from "../../../model/session-model";

const CoursePage: React.FunctionComponent = (): ReactElement => {
  return (
    <>
      <DocumentHead />
      <Main>
        <main role="main" className="slim">
          <ProfileEdit />
        </main>
      </Main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res, params: { slug } }) => {
  const session = await authorizeSessionSSRFromRequest(req, res);
  const {error: prifleError, data: profile} = await profileModel.requestProfile(slug);

  // console.log("session.user.id:", session.user.id);

  const model = {
    app: {},
    page: {
      slug: `members/${slug}`,
      yoast_head_json: {
        canonical: `https://kurst.org/members/${slug}/profile-edit`,
        title: "Редактирование профиля — Теплица.Курсы",
        metaRobotsNoindex: "noindex",
        metaRobotsNofollow: "nofollow",
        opengraphTitle: `Редактирование профиля — Теплица.Курсы`,
        opengraphUrl: `https://kurst.org/members/${slug}/prfile-edit`,
        opengraphSiteName: "Теплица.Курсы",
      },
    },
    profileEditPage: {
      profile,
    }
  };

  return {
    props: {...model, session},
  };
};

export default CoursePage;
