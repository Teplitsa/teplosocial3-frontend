import { ReactElement } from "react";
import a11yCommonStyles from "../../../inclusive-components/A11y-common.module.scss";
import AboutHero from "../../about/hero/AboutHero";
import AboutTracks from "../../about/tracks/AboutTracks";
import AboutCatalog from "../../about/catalog/AboutCatalog";
import AboutFaq from "../../about/faq/AboutFaq";
import styles from "./About.module.scss";

const About: React.FunctionComponent = (): ReactElement => {
  return (
    <main className={styles["about-page"]}>
      <div className={styles["about-page__content"]}>
        <h1 className={a11yCommonStyles["visually-hidden"]}>
          О проекте «Теплица.Курсы»
        </h1>
        <AboutHero />
        <AboutTracks />
        <AboutCatalog />
        <AboutFaq />
      </div>
    </main>
  );
};

export default About;
