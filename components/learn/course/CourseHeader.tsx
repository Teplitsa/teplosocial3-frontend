import { ReactElement, Dispatch, SetStateAction } from "react";
import { useRouter } from "next/router";
import { useStoreState, useStoreActions } from "../../../model/helpers/hooks";

import { ICourseState } from "../../../model/model.typing";
import LearnPostHeaderMeta from "../LearnPostHeaderMeta";
import Loader from "../../Loader";
import InclusiveComponents from "../../../inclusive-components/inclusive-components";

import { convertObjectToClassName } from "../../../utilities/utilities";

import styles from "./CourseHeader.module.scss";

const { Button } = InclusiveComponents;

const CourseHeader: React.FunctionComponent<{
  course: ICourseState;
  courseStartLoading: boolean;
  setCourseStartLoading: Dispatch<SetStateAction<boolean>>;
  courseStartedCallback: (params: { startBlockSlug: string }) => void;
  alternativeCourseStartingCallback?: () => void;
}> = ({
  course,
  courseStartLoading,
  setCourseStartLoading,
  courseStartedCallback,
  alternativeCourseStartingCallback,
}): ReactElement => {
  const router = useRouter();
  const session = useStoreState((state) => state.session);
  const user = useStoreState((state) => state.session.user);
  const startCourseByUser = useStoreActions(
    (actions) => actions.components.coursePage.course.startCourseByUser
  );

  const startWord = course.isStarted ? "Продолжить" : "Начать";

  return (
    <div className={styles.header}>
      <div className={styles.headerInner}>
        <LearnPostHeaderMeta post={course} connectedType={course.track} />

        <div className={styles.headerTextWithAction}>
          <div className={styles.headerTextBlock}>
            <h1 dangerouslySetInnerHTML={{ __html: course.title.rendered }} />
            {course.content?.rendered && (
              <div
                className={styles.excerpt}
                dangerouslySetInnerHTML={{ __html: course.content.rendered }}
              />
            )}
          </div>

          {!course.isCompleted && (
            <div className={styles.headerActionBlock}>
              {courseStartLoading && <Loader />}

              {!courseStartLoading && (
                <>
                  <Button
                    className={convertObjectToClassName({
                      btn_primary: course.isCompleted ? false : true,
                      btn_default: course.isCompleted ? true : false,
                      [styles.headerActionBlockBtn]: course.isCompleted
                        ? false
                        : true,
                      [styles.headerActionBlockRepeatBtn]: course.isCompleted
                        ? true
                        : false,
                    })}
                    aria-label={`${startWord} обучение по курсу «${course.title.rendered}»`}
                    onClick={() => {
                      if (!session.isLoggedIn) {
                        router.push(`/blocks/${course.nextBlockSlug}`);
                      } else if (alternativeCourseStartingCallback) {
                        alternativeCourseStartingCallback();
                      } else {
                        setCourseStartLoading(true);
                        startCourseByUser({
                          course,
                          user,
                          doneCallback: courseStartedCallback,
                        });
                      }
                    }}
                  >
                    {course.isCompleted && <span></span>}
                    {course.isCompleted
                      ? "Пройти заново"
                      : `${startWord} обучение`}
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseHeader;
