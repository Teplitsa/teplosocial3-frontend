import { ReactElement } from "react";
import Link from "next/link";
import { useStoreState } from "../../../model/helpers/hooks";
import CourseCard from "../../course-card/CourseCard";
import SkeletonCardList from "../../skeletons/partials/SkeletonCardList";
import { getDeclension } from "../../../utilities/utilities";
import styles from "./HomeCourses.module.scss";

const HomeCourses: React.FunctionComponent = (): ReactElement => {
  const courses = useStoreState((state) => state.components.homePage.courses);
  const courseTotal = useStoreState(
    (state) => state.components.homePage.courseTotal
  );

  return (
    <section className={styles["home-courses"]}>
      <div className={styles["home-courses__header"]}>
        <h2 className={styles["home-courses__title"]}>
          Новые курсы на платформе
        </h2>
        <p className={styles["home-courses__lead"]}>
          Короткие программы, которые можно пройти за несколько часов, помогут
          разобраться в конкретном вопросе или получить востребованный навык.
        </p>
        <div className={styles["home-courses__all-courses"]}>
          <Link href="/catalog#courses">
            <a
              className={styles["home-courses__all-courses-link"]}
              title={`${courseTotal} ${getDeclension({
                count: courseTotal,
                caseOneItem: "курс",
                caseTwoThreeFourItems: "курса",
                restCases: "курсов",
              })}`}
            >
              Все курсы
            </a>
          </Link>
        </div>
      </div>
      <div id="home-course-list">
        {(courses?.length && (
          <ul className={styles["home-courses__list"]}>
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
                <li key={_id} className={styles["home-courses__item"]}>
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
        )) || <SkeletonCardList limit={3} />}
      </div>
    </section>
  );
};

export default HomeCourses;
