import { ReactElement, MouseEvent, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useStoreState, useStoreActions } from "../../../model/helpers/hooks";
import { COURSES_PER_PAGE } from "../../../const";
import CourseCard from "../../course-card/CourseCard";
import SkeletonCardList from "../../skeletons/partials/SkeletonCardList";
import InclusiveComponents from "../../../inclusive-components/inclusive-components";
import {
  convertObjectToClassName,
  getDeclension,
} from "../../../utilities/utilities";
import styles from "./CatalogTracks.module.scss";

const { Button } = InclusiveComponents;

const CatalogTracks: React.FunctionComponent = (): ReactElement => {
  const tracksRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const isScrolledToTracks =
    router.asPath.search(/#tracks/) !== -1 ? true : false;
  const isTrackListLoading = useStoreState(
    (state) => state.components.catalogPage.isTrackListLoading
  );
  const tracks = useStoreState((state) => state.components.catalogPage.tracks);
  const trackTotal = useStoreState(
    (state) => state.components.catalogPage.trackTotal
  );
  const trackSkip = useStoreState(
    (state) => state.components.catalogPage.trackSkip
  );
  const shownTrackCount =
    COURSES_PER_PAGE + trackSkip > trackTotal
      ? trackTotal
      : COURSES_PER_PAGE + trackSkip;

  const setTrackSkip = useStoreActions(
    (actions) => actions.components.catalogPage.setTrackSkip
  );
  const setTrackListLoading = useStoreActions(
    (actions) => actions.components.catalogPage.setTrackListLoading
  );
  const trackListRequest = useStoreActions(
    (actions) => actions.components.catalogPage.trackListRequest
  );

  useEffect(() => {
    if (!isScrolledToTracks) return;

    (async () => {
      await router.push("/catalog", undefined, { shallow: true });

      tracksRef.current.scrollIntoView({
        block: "start",
        behavior: "smooth",
      });
    })();
  }, [router, isScrolledToTracks]);

  const handleMoreButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    setTrackSkip(shownTrackCount);
    setTrackListLoading(true);
    trackListRequest({ callback: () => setTrackListLoading(false) });
  };

  const handleResetCatalogLinkClick = (
    event: MouseEvent<HTMLAnchorElement>
  ) => {
    event.preventDefault();

    router.push("/catalog", "/catalog#tracks");
  };

  return (
    <section id="tracks" className={styles["catalog-tracks"]} ref={tracksRef}>
      <div className={styles["catalog-tracks__header"]}>
        <h2 className={styles["catalog-tracks__title"]}>Треки</h2>
        {(!trackTotal && (
          <div className={styles["catalog-tracks__empty-message"]}>
            Попробуйте переформулировать запрос, поисĸать по тегам или{" "}
            <a href="/catalog#tracks" onClick={handleResetCatalogLinkClick}>
              полистать полный каталог
            </a>{" "}
            &mdash; у нас много интересного!
          </div>
        )) || (
          <p className={styles["catalog-tracks__lead"]}>
            Подборки курсов, которые помогут изучить тему системно.
          </p>
        )}
        <div className={styles["catalog-tracks__item-count"]}>
          {trackTotal}{" "}
          {getDeclension({
            count: trackTotal,
            caseOneItem: "трек",
            caseTwoThreeFourItems: "трека",
            restCases: "треков",
          })}
        </div>
      </div>
      <div id="catalog-tracks-list">
        {!!trackTotal && (!isTrackListLoading || !!trackSkip) && (
          <ul className={styles["catalog-tracks__list"]}>
            {tracks
              .slice(0, shownTrackCount)
              .map(
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
                  <li key={_id} className={styles["catalog-tracks__item"]}>
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
        )}
        {isTrackListLoading && <SkeletonCardList />}
      </div>
      {shownTrackCount < trackTotal && (
        <div className={styles["catalog-tracks__more"]}>
          <Button
            className={convertObjectToClassName({
              btn_reset: true,
              [styles["catalog-tracks__more-btn"]]: true,
            })}
            aria-controls="catalog-tracks-list"
            onClick={handleMoreButtonClick}
          >
            Ещё {trackTotal - shownTrackCount}{" "}
            {getDeclension({
              count: trackTotal - shownTrackCount,
              caseOneItem: "трек",
              caseTwoThreeFourItems: "трека",
              restCases: "треков",
            })}{" "}
            из {trackTotal}
          </Button>
        </div>
      )}
    </section>
  );
};

export default CatalogTracks;
