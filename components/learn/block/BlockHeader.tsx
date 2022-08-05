import { ReactElement, useState } from "react";
import * as _ from "lodash";
import Link from "next/link";

import { useStoreState } from "../../../model/helpers/hooks";
import { ICourseState } from "../../../model/model.typing";
import CourseIndexBar from "../course/CourseIndexBar";
import CourseLearnProgress from "./CourseLearnProgress";

import styles from "./BlockHeader.module.scss";
import useIsomorphicLayoutEffect from "custom-hooks/use-isomorphic-layout-effect";

const BlockHeader: React.FunctionComponent<{ course: ICourseState }> = (
  props
): ReactElement => {
  const [course, setCourse] = useState<ICourseState>({ ...props.course });
  const quiz = useStoreState((state) => state.components.blockPage.quiz);

  useIsomorphicLayoutEffect(() => {
    if (
      quiz.isAdaptestPassedRepeatedly &&
      course.numberOfBlocks - course.numberOfCompletedBlocks === 1
    ) {
      setCourse((course) => {
        course.numberOfCompletedBlocks += 1;

        return { ...course };
      });
    }
  }, []);

  return (
    <div className={styles.header}>
      <div className={styles.headerInner}>
        <Link href={`/courses/${course.slug}`}>
          <a>
            <h2 dangerouslySetInnerHTML={{ __html: course.title?.rendered }} />
          </a>
        </Link>

        <div className={styles.courseIndexBar}>
          <CourseIndexBar course={course} />
        </div>

        <div className={styles.courseProgress}>
          <CourseLearnProgress {...{ course }} />
        </div>
      </div>
    </div>
  );
};

export default BlockHeader;
