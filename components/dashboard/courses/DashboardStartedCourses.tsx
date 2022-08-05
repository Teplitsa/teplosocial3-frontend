import { ReactElement, MouseEvent } from "react";
import { useRouter } from "next/router";
import { useStoreState } from "../../../model/helpers/hooks";
import CourseCard from "../../course-card/CourseCard";
import DashboardCourseTags from "../course-tags/DashboardCourseTags";
import InclusiveComponents from "../../../inclusive-components/inclusive-components";
import {
  getDeclension,
  convertObjectToClassName,
} from "../../../utilities/utilities";
import styles from "./DashboardStartedCourses.module.scss";

const { Button } = InclusiveComponents;

const DashboardStartedCourses: React.FunctionComponent = (): ReactElement => {
  const router = useRouter();
  const courses = useStoreState(
    (state) => state.components.dashboardPage.startedCourses
  );

  const handleButtonClick = (event: MouseEvent<HTMLButtonElement>) =>
    router.push("/catalog");

  return (
    <section className={styles["dashboard-started-courses"]}>
      <div className={styles["dashboard-started-courses__header"]}>
        <h2
          id="dashboard-started-courses-title"
          className={styles["dashboard-started-courses__title"]}
        >
          Текущие курсы
        </h2>
        <p className={styles["dashboard-started-courses__lead"]}>
          {courses.length === 0
            ? "У вас нет текущих курсов. Перейдите в каталог и начните обучение."
            : "Завершите обучение и получите сертификат."}
        </p>
        <div className={styles["dashboard-started-courses__all-courses"]}>
          {`${courses.length} ${getDeclension({
            count: courses.length,
            caseOneItem: "курс",
            caseTwoThreeFourItems: "курса",
            restCases: "курсов",
          })}`}
        </div>
      </div>
      {courses.length === 0 && <DashboardCourseTags />}
      {courses.length > 0 && (
        <ul
          className={styles["dashboard-started-courses__list"]}
          aria-labelledby="dashboard-started-courses-title"
        >
          {courses.map(
            ({
              _id,
              smallThumbnail,
              duration,
              title,
              teaser,
              slug,
              progress,
              isCompleted,
              trackId,
              trackSlug,
              trackTitle,
            }) => (
              <li
                key={_id}
                className={styles["dashboard-started-courses__item"]}
              >
                <CourseCard
                  {...{
                    _id,
                    slug,
                    smallThumbnail,
                    duration,
                    title,
                    teaser,
                    progress,
                    isCompleted,
                    url: `/courses/${slug}`,
                    btnText: progress
                      ? "Продолжить"
                      : isCompleted
                      ? "Повторить"
                      : "Начать обучение",
                    template: "small-thumbnail",
                    trackId,
                    trackSlug,
                    trackTitle,
                  }}
                />
              </li>
            )
          )}
          <li className={styles["dashboard-started-courses__list-action"]}>
            <h3
              className={styles["dashboard-started-courses__list-action-title"]}
            >
              Хотите больше знаний?
              <br />
              Ищите в нашем каталоге
            </h3>
            <Button
              className={convertObjectToClassName({
                btn_secondary: true,
                "btn_full-width": true,
                [styles["dashboard-started-courses__list-action-link"]]: true,
              })}
              role="link"
              onClick={handleButtonClick}
            >
              Перейти в каталог курсов
            </Button>
          </li>
        </ul>
      )}
    </section>
  );
};

export default DashboardStartedCourses;
