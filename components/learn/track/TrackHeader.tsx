import { ReactElement, useEffect, useState, MouseEvent } from "react";
import * as _ from "lodash";
import { useStoreState, useStoreActions } from "../../../model/helpers/hooks";

import {
  ITrackState,
} from "../../../model/model.typing";
import Loader from "../../Loader";
import LearnPostHeaderMeta from "../LearnPostHeaderMeta";
import InclusiveComponents from "../../../inclusive-components/inclusive-components";

import styles from '../course/CourseHeader.module.scss';

const {
  Button,
} = InclusiveComponents;

const TrackHeader: React.FunctionComponent<{
  track: ITrackState,
  trackStartLoading: boolean,
  setTrackStartLoading: (boolean) => void,
  trackStartedCallback: (any) => void,
}> = ({
  track, 
  trackStartLoading,
  setTrackStartLoading,
  trackStartedCallback,
}): ReactElement => {

  const session = useStoreState(state => state.session);
  const user = useStoreState(state => state.session.user);
  const startTrackByUser = useStoreActions(actions => actions.components.trackPage.track.startTrackByUser);

  const startWord = track.isStarted ? "Продолжить" : "Начать";

  return (
    <div className={styles.header}>
      <div className={styles.headerInner}>
        <LearnPostHeaderMeta post={track} />

        <div className={styles.headerTextWithAction}>

          <div className={styles.headerTextBlock}>
            <h1 dangerouslySetInnerHTML={{ __html: track.title.rendered }} />
            <div className={styles.excerpt} dangerouslySetInnerHTML={{ __html: track.content.rendered }} />
          </div>

          {false && session.isLoggedIn && !track.isCompleted &&
            <div className={styles.headerActionBlock}>
              {trackStartLoading && <Loader />}

              {!trackStartLoading &&
                <Button
                  className="btn_primary"
                  aria-label={`${startWord} обучение по треку «${track.title.rendered}»`}
                  onClick={() => {
                    setTrackStartLoading(true);
                    startTrackByUser({track, user, doneCallback: trackStartedCallback});
                  }}
                >
                  {`${startWord} обучение`}
                </Button>
              }
            </div>
          }

        </div>

      </div>
    </div>
  );
};

export default TrackHeader;
