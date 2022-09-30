import {
  ReactElement,
  useEffect,
  useState,
  MouseEvent,
  useLayoutEffect,
} from "react";
import * as _ from "lodash";
import { useStoreState, useStoreActions } from "../../../model/helpers/hooks";

import { ITrackState } from "../../../model/model.typing";
import CourseListItem from "../course/CourseListItem";
import Loader from "../../Loader";
import InclusiveComponents from "../../../inclusive-components/inclusive-components";

import styles from "../LearnPostContent.module.scss";
import stylesTrack from "./TrackContent.module.scss";
import CourseCard from "components/course-card/CourseCard";
import SkeletonCardList from "components/skeletons/partials/SkeletonCardList";

const { Button } = InclusiveComponents;

const TrackContent: React.FunctionComponent<{
  track: ITrackState;
  trackStartLoading: boolean;
  setTrackStartLoading: (boolean) => void;
  trackStartedCallback: (any) => void;
}> = ({
  track,
  trackStartLoading,
  setTrackStartLoading,
  trackStartedCallback,
}): ReactElement => {
  const session = useStoreState((state) => state.session);
  const user = useStoreState((state) => state.session.user);
  const courseList = useStoreState(
    (state) => state.components.trackPage.courseList
  );
  const courseListModuleList = useStoreState(
    (state) => state.components.trackPage.courseListModuleList
  );
  const requestModuleListByCourse = useStoreActions(
    (actions) => actions.components.trackPage.requestModuleListByCourse
  );
  const startTrackByUser = useStoreActions(
    (actions) => actions.components.trackPage.track.startTrackByUser
  );

  const trackCourseListRequest = useStoreActions(
    (actions) => actions.components.dashboardPage.trackCoursesListRequest
  );

  const trackCourses = useStoreState(
    (state) => state.components.dashboardPage.completedCourses
  );

  useLayoutEffect(() => {
    trackCourseListRequest({ track_id: String(track.id) });
    let x = text;
    if (track?.trackSettings?.description) {
      x[0] = track?.trackSettings?.description;
    }
    if (track?.trackSettings?.description_common) {
      x[1] = track?.trackSettings?.description_common;
    }
    setText(x);
  }, []);

  // OLD IMPLEMENTATION
  // useEffect(() => {
  //   courseList.forEach((course) => {
  //     requestModuleListByCourse({ course });
  //   });
  // }, [courseList]);

  const [titles] = useState([
    "что такое трек?",
    "о чём этот трек?",
    "Из чего состоит трек",
  ]);

  const [text, setText] = useState([
    "Трек — это подборка курсов, которая поможет изучить тему системно.",
    "После прохождения курса вы станете лучше разбираться в теме.",
    "Пройдите обучение и получите сертификат.",
  ]);

  return (
    <div className={stylesTrack.content}>
      <div className={stylesTrack.descriptionSectionWrapper}>
        {track?.trackSettings?.description_lead && (
          <h2 className={stylesTrack.descriptionLead}>
            {track?.trackSettings?.description_lead}
          </h2>
        )}
      </div>
      <div className={stylesTrack.descriptionSectionWrapper}>
        <div className={stylesTrack.descriptionSection}>
          {titles.map((item, index) => {
            return (
              <div className={stylesTrack.descriptionBlock}>
                <h3 className={stylesTrack.descriptionTitle}>{item}</h3>
                <p className={stylesTrack.descriptionText}>{text[index]}</p>
              </div>
            );
          })}
        </div>
      </div>

      {trackCourses && (
        <div className={stylesTrack.listTitleWrapper}>
          <span className={stylesTrack.listTitle}>
            {trackCourses?.length} курса
          </span>
        </div>
      )}

      {/* OLD IMPLEMENTATION  */}
      {/* <div className={styles.list}>
        {courseList.map((course) => {
          return (
            <CourseListItem
              key={`TrackCourse${course.id}`}
              course={course}
              moduleList={courseListModuleList[course.id]}
            />
          );
        })}
      </div> */}

      <div className={stylesTrack.descriptionSectionWrapper}>
        {(trackCourses?.length && (
          <ul className={stylesTrack.trackCourses}>
            {trackCourses.map(
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
                <li key={_id} className={stylesTrack["trackCourse__item"]}>
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
        )) || <SkeletonCardList limit={2} />}
      </div>

      {session.isLoggedIn && !track.isCompleted && (
        <div className={stylesTrack.startAction}>
          {trackStartLoading && <Loader />}

          {!trackStartLoading && (
            <Button
              className="btn_primary"
              aria-label={`${
                track.isStarted ? "Продолжить" : "Начать"
              } обучение по треку «${track.title.rendered}»`}
              onClick={() => {
                setTrackStartLoading(true);
                startTrackByUser({
                  track,
                  user,
                  doneCallback: trackStartedCallback,
                });
              }}
            >
              {track.isStarted ? "Продолжить обучение" : "Приступить"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default TrackContent;
