import { ReactElement } from "react";
import { useStoreState } from "../../../model/helpers/hooks";
import { getDeclension } from "../../../utilities/utilities";
import a11yCommonStyles from "../../../inclusive-components/A11y-common.module.scss";
import styles from "./AboutHero.module.scss";

const AboutHero: React.FunctionComponent = (): ReactElement => {
  const {
    course: { total: courseTotal },
    track: { total: trackTotal },
  } = useStoreState((state) => state.components.aboutPage.stats);

  return (
    <section className={styles["about-hero"]}>
      <h2 className={a11yCommonStyles["visually-hidden"]}>
        Что такое «Теплица.Курсы»?
      </h2>
      <div className={styles["about-hero__text"]}>
        <p className={styles["about-hero__lead"]}>
          «Теплица.Курсы» — это библиотека бесплатных онлайн-курсов
          с актуальными знаниями для активистов и сотрудников НКО
        </p>
        <p>
          Наши эксперты — это представители некоммерческого сектора и бизнеса
          с большим опытом и мощными кейсами в багаже.
        </p>
        <div className={styles["about-hero__statistics"]}>
          <div className={styles["about-hero__statistics-item"]}>
            <span className={styles["about-hero__statistics-value"]}>
              {courseTotal}
            </span>
            <span
              dangerouslySetInnerHTML={{
                __html: getDeclension({
                  count: courseTotal,
                  caseOneItem: "онлайн<br />курс",
                  caseTwoThreeFourItems: "онлайн<br />курса",
                  restCases: "онлайн<br />курсов",
                }),
              }}
            />
          </div>
          <div className={styles["about-hero__statistics-item"]}>
            <span className={styles["about-hero__statistics-value"]}>
              {trackTotal}
            </span>
            <span
              dangerouslySetInnerHTML={{
                __html: getDeclension({
                  count: trackTotal,
                  caseOneItem: "образовательный<br />трек",
                  caseTwoThreeFourItems: "образовательных<br />трека",
                  restCases: "образовательных<br />треков",
                }),
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
