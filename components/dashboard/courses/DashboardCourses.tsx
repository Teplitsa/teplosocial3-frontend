import { ReactElement, MouseEvent } from "react";
import { useStoreState, useStoreActions } from "../../../model/helpers/hooks";
import CourseCard from "../../course-card/CourseCard";
import SkeletonCardList from "../../skeletons/partials/SkeletonCardList";
import DashboardCourseFilter from "../course-filter/DashboardCourseFilter";
import InclusiveComponents from "../../../inclusive-components/inclusive-components";
import { COURSES_PER_PAGE } from "../../../const";
import {
  getDeclension,
  convertObjectToClassName,
} from "../../../utilities/utilities";
import styles from "./DashboardCourses.module.scss";

const { Button } = InclusiveComponents;

const DashboardCourses: React.FunctionComponent = (): ReactElement => {
  const certificates = useStoreState(
    (state) => state.components.dashboardPage.certificates
  );
  const courses = useStoreState(
    (state) => state.components.dashboardPage.completedCourses
  );
  const courseTotal = useStoreState(
    (state) => state.components.dashboardPage.completedCourseTotal
  );
  const isCourseListLoading = useStoreState(
    (state) => state.components.dashboardPage.isCompletedCourseListLoading
  );
  const courseSkip = useStoreState(
    (state) => state.components.dashboardPage.completedCourseSkip
  );
  const shownCourseCount =
    COURSES_PER_PAGE + courseSkip > courseTotal
      ? courseTotal
      : COURSES_PER_PAGE + courseSkip;

  const setCourseSkip = useStoreActions(
    (actions) => actions.components.dashboardPage.setCompletedCourseSkip
  );
  const setCourseListLoading = useStoreActions(
    (actions) => actions.components.dashboardPage.setCompletedCourseListLoading
  );
  const courseListRequest = useStoreActions(
    (actions) => actions.components.dashboardPage.completedCourseListRequest
  );

  const handleMoreButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    setCourseSkip(shownCourseCount);
    setCourseListLoading(true);
    courseListRequest({ callback: () => setCourseListLoading(false) });
  };

  if (!courses?.length) {
    return null;
  }

  return (
    <section className={styles["dashboard-courses"]}>
      <div className={styles["dashboard-courses__header"]}>
        <h2 className={styles["dashboard-courses__title"]}>Пройденные курсы</h2>
        <p className={styles["dashboard-courses__lead"]}>
          Вы всегда можете вернуться к пройденным курсам
        </p>
        <div className={styles["dashboard-courses__all-courses"]}>
          {`${courseTotal} ${getDeclension({
            count: courseTotal,
            caseOneItem: "курс",
            caseTwoThreeFourItems: "курса",
            restCases: "курсов",
          })}`}
        </div>
      </div>
      <DashboardCourseFilter />
      <div id="dashboard-course-list">
        {!!courseTotal && (!isCourseListLoading || !!courseSkip) && (
          <ul className={styles["dashboard-courses__list"]}>
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
                <li key={_id} className={styles["dashboard-courses__item"]}>
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
                      certificates: {
                        horizontal: certificates.find(
                          ({ courseName }) => courseName === title
                        )?.certificateId,
                      },
                      trackId,
                      trackSlug,
                      trackTitle,
                    }}
                  />
                </li>
              )
            )}
          </ul>
        )}
        {!courseTotal && (
          <>
            <h3 className={styles["dashboard-courses__subtitle"]}>
              Кажется, вы не проходили такого курса
            </h3>
            <div className={styles["dashboard-courses__empty-message"]}>
              Проверьте, правильно ли написано название и попробуйте снова.
              <br />
              Если вы точно проходили курс, но его здесь нет, пишите на{" "}
              <a href="mailto:help@te-st.ru" target="_blank">
                help@te-st.ru
              </a>
            </div>
          </>
        )}
        {isCourseListLoading && <SkeletonCardList />}
        {shownCourseCount < courseTotal && (
          <div className={styles["dashboard-courses__more"]}>
            <Button
              className={convertObjectToClassName({
                btn_reset: true,
                [styles["dashboard-courses__more-btn"]]: true,
              })}
              aria-controls="dashboard-course-list"
              onClick={handleMoreButtonClick}
            >
              Ещё {courseTotal - shownCourseCount}{" "}
              {getDeclension({
                count: courseTotal - shownCourseCount,
                caseOneItem: "курс",
                caseTwoThreeFourItems: "курса",
                restCases: "курсов",
              })}{" "}
              из {courseTotal}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default DashboardCourses;
