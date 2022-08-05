import { ReactElement, ChangeEvent, MouseEvent } from "react";
import { useStoreState, useStoreActions } from "../../../model/helpers/hooks";
import InclusiveComponents from "../../../inclusive-components/inclusive-components";
import {
  convertObjectToClassName,
  getDeclension,
} from "../../../utilities/utilities";
import styles from "./DashboardCourseFilter.module.scss";

const { InputSearch, Button } = InclusiveComponents;

const DashboardCourseFilter: React.FunctionComponent = (): ReactElement => {
  const searchPhrase = useStoreState(
    (state) => state.components.dashboardPage.completedCourseFilter.searchPhrase
  );
  const searchTooltips = useStoreState(
    (state) =>
      state.components.dashboardPage.completedCourseFilter.searchTooltips
        .courses
  );
  const courses = useStoreState(
    (state) => state.components.dashboardPage.completedCourses
  );

  const setSearchPhrase = useStoreActions(
    (actions) => actions.components.dashboardPage.setSearchPhrase
  );
  const setCourseSkip = useStoreActions(
    (actions) => actions.components.dashboardPage.setCompletedCourseSkip
  );
  const setCourseListLoading = useStoreActions(
    (actions) => actions.components.dashboardPage.setCompletedCourseListLoading
  );
  const courseListRequest = useStoreActions(
    (actions) => actions.components.dashboardPage.completedCourseListRequest
  );
  const courseTooltipstRequest = useStoreActions(
    (actions) => actions.components.dashboardPage.completedCourseTooltipsRequest
  );

  const onSearchPhraseChange = (searchPhrase: string): void => {
    setSearchPhrase(searchPhrase);
    courseTooltipstRequest();
    setCourseSkip(0);
    setCourseListLoading(true);
    courseListRequest({ callback: () => setCourseListLoading(false) });
  };

  const handleSearchInput = (event: ChangeEvent<HTMLInputElement>): void =>
    onSearchPhraseChange(event.currentTarget.value);

  const handleButtonClickFactory =
    (title: string) =>
    (event: MouseEvent<HTMLButtonElement>): void =>
      onSearchPhraseChange(title);

  return (
    <div className={styles["dashboard-course-filter"]}>
      <div className={styles["dashboard-course-filter__search-combobox"]}>
        <InputSearch
          wrapperClassName={styles["dashboard-course-filter__search-wrapper"]}
          className={styles["dashboard-course-filter__search"]}
          type="search"
          value={searchPhrase}
          placeholder="Поиск по курсам"
          aria-controls="dashboard-course-list"
          aria-label="Поиск по курсам"
          aria-describedby="quick-results"
          autoComplete="off"
          onInput={handleSearchInput}
        />
        <div
          id="quick-results"
          className={styles["quick-results"]}
          role="tooltip"
          hidden={
            !Array.isArray(searchTooltips) ||
            searchTooltips.length === 0 ||
            courses.length > 0
          }
        >
          <ul className={styles["quick-results__list"]}>
            {searchTooltips?.map(
              ({ _id, title, duration, trackId, trackTitle }) => {
                const durationComponents = {
                  hours: Math.floor(duration / 60),
                  minutes: duration % 60,
                };

                return (
                  <li
                    key={`QuickResultsEntity-${_id}`}
                    className={styles["quick-results__entity"]}
                  >
                    <Button
                      className={convertObjectToClassName({
                        btn_reset: true,
                        "btn_full-width": true,
                        [styles["quick-results__entity-btn"]]: true,
                      })}
                      onClick={handleButtonClickFactory(title)}
                    >
                      <span className={styles["quick-results__entity-name"]}>
                        {trackId ? "Курс." : "Трек."}
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
                      {!!trackId && (
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
                    </Button>
                  </li>
                );
              }
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardCourseFilter;
