import { ReactElement } from "react";
import { useStoreState } from "../../../model/helpers/hooks";
import { getDeclension } from "../../../utilities/utilities";
import styles from "./DashboardPoints.module.scss";

const DashboardPoints: React.FunctionComponent = (): ReactElement => {
  const points = useStoreState((state) => state.session.user.points);

  return (
    <section className={styles["dashboard-points"]}>
      <div className={styles["dashboard-points__header"]}>
        <h2
          id="dashboard-points-title"
          className={styles["dashboard-points__title"]}
        >
          Баллы
        </h2>
        <p className={styles["dashboard-points__lead"]}>
          Вы получаете баллы за ваши достижения на платформе
        </p>
        <div className={styles["dashboard-points__total"]}>
          {`${points} ${getDeclension({
            count: points,
            caseOneItem: "балл",
            caseTwoThreeFourItems: "балла",
            restCases: "баллов",
          })}`}
        </div>
      </div>
    </section>
  );
};

export default DashboardPoints;
