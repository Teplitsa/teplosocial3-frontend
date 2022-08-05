import { ReactElement } from "react";
import { useStoreState } from "../../../model/helpers/hooks";
import { getDeclension } from "../../../utilities/utilities";
import styles from "./HomeStats.module.scss";

const HomeStats: React.FunctionComponent = (): ReactElement => {
  const stats = useStoreState((state) => state.components.homePage.stats);

  return (
    <section className={styles["home-stats"]}>
      <h2 className={styles["home-stats__title"]}>
        Статистика платформы Теплица.Курсы
      </h2>
      <ul className={styles["home-stats__list"]}>
        <li className={styles["home-stats__item"]}>
          <span className={styles["home-stats__item-value"]}>
            {stats?.track.total}
          </span>
          <span className={styles["home-stats__item-title"]}>
            {getDeclension({
              count: stats?.track.total,
              caseOneItem: "Образовательный трек",
              caseTwoThreeFourItems: "Образовательных трека",
              restCases: "Образовательных треков",
            })}
          </span>
        </li>
        <li className={styles["home-stats__item"]}>
          <span className={styles["home-stats__item-value"]}>
            {stats?.course.total}
          </span>
          <span className={styles["home-stats__item-title"]}>
            {getDeclension({
              count: stats?.course.total,
              caseOneItem: "Образовательный курс",
              caseTwoThreeFourItems: "Образовательных курса",
              restCases: "Образовательных курсов",
            })}
          </span>
        </li>
        <li className={styles["home-stats__item"]}>
          <span className={styles["home-stats__item-value"]}>
            {stats?.certificate.total}
          </span>
          <span className={styles["home-stats__item-title"]}>
            {getDeclension({
              count: stats?.certificate.total,
              caseOneItem: "Выданный сертификат",
              caseTwoThreeFourItems: "Выданных сертификата",
              restCases: "Выданных сертификатов",
            })}
          </span>
        </li>
        <li className={styles["home-stats__item"]}>
          <span className={styles["home-stats__item-value"]}>
            {stats?.user.total}
          </span>
          <span className={styles["home-stats__item-title"]}>
            {getDeclension({
              count: stats?.user.total,
              caseOneItem: "Зарегистрированный пользователь",
              caseTwoThreeFourItems: "Зарегистрированных пользователя",
              restCases: "Зарегистрированных пользователей",
            })}
          </span>
        </li>
      </ul>
    </section>
  );
};

export default HomeStats;
