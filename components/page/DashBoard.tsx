import { ReactElement } from "react";
import DashboardPoints from "../dashboard/points/DashboardPoints";
import DashboardStartedCourses from "../dashboard/courses/DashboardStartedCourses";
import DashboardCourses from "../dashboard/courses/DashboardCourses";
import DashboardUserInfo from "../dashboard/user-info/DashboardUserInfo";
import { convertObjectToClassName } from "../../utilities/utilities";
import styles from "./Home.module.scss";

const DashBoard: React.FunctionComponent = (): ReactElement => {
  return (
    <main
      className={convertObjectToClassName({
        [styles["home"]]: true,
        [styles["home_dashboard"]]: true,
      })}
    >
      <h1 className={styles["home__title_dashboard"]}>Дашборд</h1>
      <DashboardUserInfo />
      <DashboardPoints />
      <DashboardStartedCourses />
      <DashboardCourses />
    </main>
  );
};

export default DashBoard;
