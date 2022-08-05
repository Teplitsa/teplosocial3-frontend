import { ReactElement, useEffect } from "react";
import { GetServerSideProps } from "next";
import * as _ from "lodash";

import DocumentHead from "../../../components/DocumentHead";
import Main from "../../../components/layout/Main";
import Profile from "../../../components/page/member/Profile";
import * as profileModel from "../../../model/member/profile-model";
import { authorizeSessionSSRFromRequest } from "../../../model/session-model";

const CoursePage: React.FunctionComponent = (): ReactElement => {
  return (
    <>
      <DocumentHead />
      <Main>
        <main role="main" className="slim">
          <Profile />
        </main>
      </Main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res, params: { slug } }) => {
  const session = await authorizeSessionSSRFromRequest(req, res);
  const {error: prifleError, data: profile} = await profileModel.requestProfile(slug);

  // console.log("session.user.id:", session.user.id);
  // console.log("profile data:", profile);
  // console.log("session.user:", session.user);

  const model = {
    app: {},
    page: {
      slug: `members/${slug}`,
      yoast_head_json: {
        canonical: `https://kurs.te-st.ru/members/${slug}`,
        title: "Профиль пользователя — Теплица.Курсы",
        description: profile.description ?? "",
        opengraphTitle: `Профиль пользователя — Теплица.Курсы`,
        opengraphUrl: `https://kurs.te-st.ru/members/${slug}`,
        opengraphSiteName: "Теплица.Курсы",
      },
    },
    profilePage: {
      profile,
    }
  };

  return {
    props: {...model, session},
  };
};

export default CoursePage;
