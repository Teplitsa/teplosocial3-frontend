import { ReactElement, useEffect, useState, MouseEvent } from "react";
import * as _ from "lodash";
import { useStoreState, useStoreActions } from "../../../model/helpers/hooks";

import { ITrackState } from "../../../model/model.typing";
import CourseListItem from "../course/CourseListItem";
import Loader from "../../Loader";
import InclusiveComponents from "../../../inclusive-components/inclusive-components";

import styles from "../LearnPostContent.module.scss";
import stylesTrack from "./TrackContent.module.scss";

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
  // console.log("courseList:", courseList)

  useEffect(() => {
    courseList.forEach((course) => {
      requestModuleListByCourse({ course });
    });
  }, [courseList]);

  return (
    <div className={stylesTrack.content}>
      <div className={styles.listTitleWrapper}>
        <span className={styles.listTitle}>Программа трека</span>
      </div>

      <div className={styles.list}>
        {courseList.map((course) => {
          return (
            <CourseListItem
              key={`TrackCourse${course.id}`}
              course={course}
              moduleList={courseListModuleList[course.id]}
            />
          );
        })}
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
