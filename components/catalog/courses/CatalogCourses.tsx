import { ReactElement, MouseEvent, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useStoreState, useStoreActions } from "../../../model/helpers/hooks";
import CourseCard from "../../course-card/CourseCard";
import SkeletonCardList from "../../skeletons/partials/SkeletonCardList";
import InclusiveComponents from "../../../inclusive-components/inclusive-components";
import { COURSES_PER_PAGE } from "../../../const";
import {
  convertObjectToClassName,
  getDeclension,
} from "../../../utilities/utilities";
import styles from "./CatalogCourses.module.scss";

const { Button } = InclusiveComponents;

const CatalogCourses: React.FunctionComponent = (): ReactElement => {
  const coursesRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const isScrolledToCourses =
    router.asPath.search(/#courses/) !== -1 ? true : false;
  const isCourseListLoading = useStoreState(
    (state) => state.components.catalogPage.isCourseListLoading
  );
  const courses = useStoreState(
    (state) => state.components.catalogPage.courses
  );
  const courseTotal = useStoreState(
    (state) => state.components.catalogPage.courseTotal
  );
  const courseSkip = useStoreState(
    (state) => state.components.catalogPage.courseSkip
  );
  const shownCourseCount =
    COURSES_PER_PAGE + courseSkip > courseTotal
      ? courseTotal
      : COURSES_PER_PAGE + courseSkip;

  const setCourseSkip = useStoreActions(
    (actions) => actions.components.catalogPage.setCourseSkip
  );
  const setCourseListLoading = useStoreActions(
    (actions) => actions.components.catalogPage.setCourseListLoading
  );
  const courseListRequest = useStoreActions(
    (actions) => actions.components.catalogPage.courseListRequest
  );

  useEffect(() => {
    if (!isScrolledToCourses) return;

    (async () => {
      await router.push("/catalog", undefined, { shallow: true });

      coursesRef.current.scrollIntoView({
        block: "start",
        behavior: "smooth",
      });
    })();
  }, [router, isScrolledToCourses]);

  const handleMoreButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    setCourseSkip(shownCourseCount);
    setCourseListLoading(true);
    courseListRequest({ callback: () => setCourseListLoading(false) });
  };

  const handleResetCatalogLinkClick = (
    event: MouseEvent<HTMLAnchorElement>
  ) => {
    event.preventDefault();

    router.push("/catalog", "/catalog#courses");
  };

  return (
    <section id="courses" className={styles["catalog-courses"]} ref={coursesRef}>
      <div className={styles["catalog-courses__header"]}>
        <h2 className={styles["catalog-courses__title"]}>Курсы</h2>
        {(!courseTotal && (
          <div className={styles["catalog-courses__empty-message"]}>
            Попробуйте переформулировать запрос, поискать по тегам или{" "}
            <a href="/catalog#courses" onClick={handleResetCatalogLinkClick}>
              полистать полный каталог
            </a>{" "}
            &mdash; у нас много интересного!
          </div>
        )) || (
          <p className={styles["catalog-courses__lead"]}>
            Короткие программы, которые можно пройти за несколько часов.
            <br />
            Помогут разобраться в конкретном вопросе или получить востребованный
            навык.
          </p>
        )}
        <div className={styles["catalog-courses__item-count"]}>
          {courseTotal}{" "}
          {getDeclension({
            count: courseTotal,
            caseOneItem: "курс",
            caseTwoThreeFourItems: "курса",
            restCases: "курсов",
          })}
        </div>
      </div>
      <div id="catalog-courses-list">
        {!!courseTotal && (!isCourseListLoading || !!courseSkip) && (
          <ul className={styles["catalog-courses__list"]}>
            {courses
              .slice(0, shownCourseCount)
              .map(
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
                  <li key={_id} className={styles["catalog-courses__item"]}>
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
          </ul>
        )}
        {isCourseListLoading && <SkeletonCardList />}
      </div>
      {shownCourseCount < courseTotal && (
        <div className={styles["catalog-courses__more"]}>
          <Button
            className={convertObjectToClassName({
              btn_reset: true,
              [styles["catalog-courses__more-btn"]]: true,
            })}
            aria-controls="catalog-courses-list"
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
    </section>
  );
};

export default CatalogCourses;
