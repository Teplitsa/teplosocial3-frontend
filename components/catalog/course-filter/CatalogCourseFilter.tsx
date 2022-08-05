import { ReactElement, MouseEvent, ChangeEvent } from "react";
import { useStoreState, useStoreActions } from "../../../model/helpers/hooks";
import InclusiveComponents from "../../../inclusive-components/inclusive-components";
import {
  convertObjectToClassName,
  getDeclension,
} from "../../../utilities/utilities";
import styles from "./CatalogCourseFilter.module.scss";
import { TagId } from "../../../model/model.typing";

const { InputSearch, Button } = InclusiveComponents;

const CatalogCourseFilter: React.FunctionComponent = (): ReactElement => {
  const searchPhrase = useStoreState(
    (state) => state.components.catalogPage.courseFilter.searchPhrase
  );
  const courseTooltips = useStoreState(
    (state) => state.components.catalogPage.courseFilter.searchTooltips.courses
  );
  const courses = useStoreState(
    (state) => state.components.catalogPage.courses
  );
  const tracks = useStoreState((state) => state.components.catalogPage.tracks);
  const trackTooltips = useStoreState(
    (state) => state.components.catalogPage.courseFilter.searchTooltips.tracks
  );
  const searchTooltips = [...(courseTooltips ?? []), ...(trackTooltips ?? [])];
  const tags = useStoreState(
    (state) => state.components.catalogPage.courseFilter.tags
  );
  const activeTags = useStoreState(
    (state) => state.components.catalogPage.courseFilter.activeTags
  );

  const setSearchPhrase = useStoreActions(
    (actions) => actions.components.catalogPage.setSearchPhrase
  );
  const setActiveTags = useStoreActions(
    (actions) => actions.components.catalogPage.setActiveTags
  );
  const setCourseSkip = useStoreActions(
    (actions) => actions.components.catalogPage.setCourseSkip
  );
  const setTrackSkip = useStoreActions(
    (actions) => actions.components.catalogPage.setTrackSkip
  );
  const setCourseListLoading = useStoreActions(
    (actions) => actions.components.catalogPage.setCourseListLoading
  );
  const setTrackListLoading = useStoreActions(
    (actions) => actions.components.catalogPage.setTrackListLoading
  );
  const courseListRequest = useStoreActions(
    (actions) => actions.components.catalogPage.courseListRequest
  );
  const trackListRequest = useStoreActions(
    (actions) => actions.components.catalogPage.trackListRequest
  );
  const courseTooltipstRequest = useStoreActions(
    (actions) => actions.components.catalogPage.courseTooltipstRequest
  );
  const trackTooltipstRequest = useStoreActions(
    (actions) => actions.components.catalogPage.trackTooltipstRequest
  );

  const handleSearchInput = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchPhrase(event.currentTarget.value);
    courseTooltipstRequest();
    trackTooltipstRequest();
    setCourseSkip(0);
    setTrackSkip(0);
    setCourseListLoading(true);
    setTrackListLoading(true);
    courseListRequest({ callback: () => setCourseListLoading(false) });
    trackListRequest({ callback: () => setTrackListLoading(false) });
  };

  const handleButtonClickFactory =
    (id: TagId) => (event: MouseEvent<HTMLButtonElement>) => {
      setActiveTags(id);
      courseTooltipstRequest();
      trackTooltipstRequest();
      setCourseSkip(0);
      setTrackSkip(0);
      setCourseListLoading(true);
      setTrackListLoading(true);
      courseListRequest({ callback: () => setCourseListLoading(false) });
      trackListRequest({ callback: () => setTrackListLoading(false) });
    };

  return (
    <section className={styles["catalog-course-filter"]}>
      <ul
        id={styles["catalog-course-filter__list"]}
        className={styles["catalog-course-filter__list"]}
      >
        {tags.map(({ _id, externalId, name }) => (
          <li
            key={`CatalogCourseFilterItem-${_id}`}
            className={styles["catalog-course-filter__item"]}
          >
            <Button
              className={convertObjectToClassName({
                [styles["catalog-course-filter__btn"]]: true,
                [styles["catalog-course-filter__btn_active"]]:
                  activeTags.includes(externalId),
              })}
              aria-controls="catalog-courses-list catalog-tracks-list"
              onClick={handleButtonClickFactory(externalId)}
            >
              {name}
            </Button>
          </li>
        ))}
      </ul>
      <div className={styles["catalog-course-filter__search-combobox"]}>
        <InputSearch
          className={styles["catalog-course-filter__search"]}
          type="search"
          value={searchPhrase}
          placeholder="Поиск"
          aria-controls="catalog-courses-list catalog-tracks-list"
          aria-label="Поиск по каталогу курсов"
          aria-describedby="quick-results"
          autoComplete="off"
          onInput={handleSearchInput}
        />
        <div
          id="quick-results"
          className={styles["quick-results"]}
          role="tooltip"
          hidden={
            searchTooltips.length === 0 ||
            courses.length > 0 ||
            tracks.length > 0
          }
        >
          <ul className={styles["quick-results__list"]}>
            {searchTooltips.map(
              ({ _id, slug, title, duration, trackId, trackTitle }) => {
                const durationComponents = {
                  hours: Math.floor(duration / 60),
                  minutes: duration % 60,
                };
                const isCourse = typeof trackId === "number" && trackId >= 0;

                return (
                  <li
                    key={`QuickResultsEntity-${_id}`}
                    className={styles["quick-results__entity"]}
                  >
                    <a
                      href={isCourse ? `/courses/${slug}` : `/tracks/${slug}`}
                      className={styles["quick-results__entity-link"]}
                    >
                      <span className={styles["quick-results__entity-name"]}>
                        {isCourse ? "Курс." : "Трек."}
                      </span>{" "}
                      <span
                        className={styles["quick-results__entity-title"]}
                        dangerouslySetInnerHTML={{
                          __html: title.replace(
                            new RegExp(`${searchPhrase.trim()}`, "i"),
                            `<mark class="${styles["quick-results__mark"]}">$&</mark>`
                          ),
                        }}
                      />{" "}
                      <span
                        className={styles["quick-results__entity-duration"]}
                      >
                        {durationComponents.hours > 0
                          ? `${durationComponents.hours} `
                          : ""}
                        {durationComponents.hours > 0 &&
                          getDeclension({
                            count: durationComponents.hours,
                            caseOneItem: "час",
                            caseTwoThreeFourItems: "часа",
                            restCases: "часов",
                          })}
                        {durationComponents.hours > 0 && " "}
                        {durationComponents.minutes > 0
                          ? `${durationComponents.minutes} `
                          : ""}
                        {durationComponents.minutes > 0 &&
                          getDeclension({
                            count: durationComponents.minutes ?? 0,
                            caseOneItem: "минута",
                            caseTwoThreeFourItems: "минуты",
                            restCases: "минут",
                          })}
                      </span>{" "}
                      {isCourse && trackTitle && (
                        <span className={styles["quick-results__entity-track"]}>
                          <span
                            className={
                              styles["quick-results__entity-track-caption"]
                            }
                          >
                            Курс является частью трека:
                          </span>{" "}
                          {trackTitle}
                        </span>
                      )}
                    </a>
                  </li>
                );
              }
            )}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default CatalogCourseFilter;
