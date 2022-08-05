import { ReactElement, useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useStoreState } from "../../model/helpers/hooks";

import withGlobalComponents from "../hoc/withGlobalComponents";
import Header from "./partials/Header";
import Footer from "./partials/Footer";
import FooterNav from "./partials/FooterNav";
import FooterLicence from "./partials/FooterLicence";
import FooterSocial from "./partials/FooterSocial";
import FooterTags from "./partials/FooterTags";
import OutsideSiteContainer from "./partials/OutsideSiteContainer";
import HeaderContent from "./partials/header-content/HeaderContent";
import LearnProgress from "../learn/LearnProgress";
// import BreadCrumbs from "../../components/BreadCrumbs";
import styles from "./Main.module.scss";

const Main: React.FunctionComponent = ({ children }): ReactElement => {
  const router = useRouter();
  const siteContainerRef = useRef<HTMLDivElement>(null);
  const [mustShowProgress, setMustShowProgress] = useState(false);
  const isLoggedIn = useStoreState((state) => state.session.isLoggedIn);

  useEffect(() => {
    setMustShowProgress(
      (!!router.pathname.match(/^\/$/) && isLoggedIn) ||
        !!router.pathname.match(/\/tracks\/|\/courses\//)
    );
  }, [router]);

  return (
    <>
      <div ref={siteContainerRef} className={styles["site-container"]}>
        <Header>
          <HeaderContent />
          {mustShowProgress && <LearnProgress />}
        </Header>
        {/*
      <BreadCrumbs />
      */}
        {children}
        <Footer>
          <FooterSocial />
          <FooterTags />
          <FooterNav />
          <FooterLicence />
        </Footer>
      </div>
      <OutsideSiteContainer {...{ siteContainerRef }} />
    </>
  );
};

export default withGlobalComponents(Main);
