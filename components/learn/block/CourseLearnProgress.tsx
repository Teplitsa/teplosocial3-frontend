import { ReactElement, useEffect, useState } from "react";
import * as _ from "lodash";

import { useStoreState } from "../../../model/helpers/hooks";
import InclusiveComponents from "../../../inclusive-components/inclusive-components";
import { ICourseState } from "model/model.typing";

const {
  ProgressBar,
} = InclusiveComponents;

const CourseLearnProgress: React.FunctionComponent<{
  course: ICourseState,
}> = ({
  course
}): ReactElement => {
  const [progressCourse, setProgressCourse] = useState(null)
  const [progressValue, setProgressValue] = useState(null)
  const [progress, setProgress] = useState(null)
  const isLoggedIn = useStoreState(state => state.session.isLoggedIn);

  useEffect(() => {
    if(!course || !isLoggedIn) {
      return;
    }

    setProgressCourse(course);
  }, [course, isLoggedIn])

  useEffect(() => {
    if(!progressCourse) {
      return;
    }

    // console.log("progressCourse.numberOfCompletedBlocks:", progressCourse.numberOfCompletedBlocks);
    // console.log("progressCourse.numberOfBlocks:", progressCourse.numberOfBlocks);
    setProgressValue(
      progressCourse.numberOfBlocks 
        ? Math.floor(progressCourse.numberOfCompletedBlocks * 100 / progressCourse.numberOfBlocks) 
        : 0
      );
  }, [progressCourse])

  useEffect(() => {
    // console.log("progressValue:", progressValue);

    if(progressValue === null) {
      return
    }

    setProgress({
      valueNow: progressValue,
      valueText: `Прогресс обучения ${progressValue}%`,
      label: "Прогресс обучения",
      visibleText: `Пройдено ${progressValue}%`,
    });
  }, [progressValue])

  if(!progress) {
    return null;
  }

  return (
    <ProgressBar {...progress} />
  );
};

export default CourseLearnProgress;
