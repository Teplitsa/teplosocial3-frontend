import { ReactElement, useEffect } from "react";
import { GetServerSideProps } from "next";
import * as _ from "lodash";

import DocumentHead from "../components/DocumentHead";
import Main from "../components/layout/Main";
import Team from "../components/page/Team";
import * as pageModel from "../model/page-model";
import * as teamMembersModel from "../model/components/team-mebers";

const TeamPage: React.FunctionComponent = (): ReactElement => {
  return (
    <>
      <DocumentHead />
      <Main>
        <main className="site-main team-page" role="main">
          <Team />
        </main>
      </Main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const { error, data } = await pageModel.requestPageComponentData("teampage");
  const { error: teamMembersError, data: teamMembersData } =
    await teamMembersModel.requestTeamMembersComponentData();

  const model = {
    app: {},
    page: data,
    teamPage: {
      ...data,
      teamMembers: {
        items: teamMembersData,
      },
    },
  };

  return {
    props: { ...model },
  };
};

export default TeamPage;
