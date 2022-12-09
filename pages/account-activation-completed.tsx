import { ReactElement, useEffect } from "react";
import { GetServerSideProps } from "next";
import * as _ from "lodash";

import DocumentHead from "../components/DocumentHead";
import Main from "../components/layout/Main";
import AccountActivated from "../components/page/auth/account-activated/AccountActivated";

const AccountActivationCompletedPage: React.FunctionComponent = (): ReactElement => {
  return (
    <>
      <DocumentHead />
      <Main>
        <main id="site-main" className="site-main" role="main">
          <AccountActivated />
        </main>
      </Main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const model = {
    app: {},
    page: {
      slug: `account-activation-completed`,
      seo: {
        canonical: `https://kurst.org/account-activation-completed`,
        title: "Аккаунт подтвержден - Теплица.Курсы",
        opengraphTitle: `Аккаунт подтвержден - Теплица.Курсы`,
        opengraphUrl: `https://kurst.org/account-activation-completed`,
        opengraphSiteName: "Теплица.Курсы",
      },
    },
  };

  return {
    props: {...model},
  };
};

export default AccountActivationCompletedPage;
