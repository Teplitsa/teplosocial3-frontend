import { ReactElement } from "react";
import Link from "next/link";
import { useStoreState } from "../../../model/helpers/hooks";
import CourseCard from "../../course-card/CourseCard";
import SkeletonCardList from "../../skeletons/partials/SkeletonCardList";
import { getDeclension } from "../../../utilities/utilities";
import styles from "./HomeTracks.module.scss";

const HomeTracks: React.FunctionComponent = (): ReactElement => {
  const tracks = useStoreState((state) => state.components.homePage.tracks);
  const trackTotal = useStoreState(
    (state) => state.components.homePage.trackTotal
  );

  return (
    <section className={styles["home-tracks"]}>
      <div className={styles["home-tracks__header"]}>
        <h2 className={styles["home-tracks__title"]}>
          Треки: полное погружение в тему
        </h2>
        <p className={styles["home-tracks__lead"]}>
          Подборки курсов, которые помогут изучить тему системно.
        </p>
        <div className={styles["home-tracks__all-tracks"]}>
          <Link href="/catalog#tracks">
            <a
              className={styles["home-tracks__all-tracks-link"]}
              title={`${trackTotal} ${getDeclension({
                count: trackTotal,
                caseOneItem: "трек",
                caseTwoThreeFourItems: "трека",
                restCases: "треков",
              })}`}
            >
              Все треки
            </a>
          </Link>
        </div>
      </div>
      <div id="home-track-list">
        {(tracks?.length && (
          <ul className={styles["home-tracks__list"]}>
            {tracks.map(
              ({
                _id,
                thumbnail,
                duration,
                title,
                teaser,
                slug,
                progress,
                isCompleted,
              }) => (
                <li key={_id} className={styles["home-tracks__item"]}>
                  <CourseCard
                    {...{
                      _id,
                      slug,
                      teaser,
                      thumbnail,
                      duration,
                      title,
                      url: `/tracks/${slug}`,
                      progress,
                      isCompleted,
                      btnText: progress
                        ? "Продолжить"
                        : isCompleted
                        ? "Повторить"
                        : "Начать обучение",
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

export default HomeTracks;
