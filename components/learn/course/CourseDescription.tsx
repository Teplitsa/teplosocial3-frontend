import { ReactElement, forwardRef } from "react";
import withShortcodes from "../../hoc/withShortcodes";
import { ICourseState } from "../../../model/model.typing";
import styles from "./CourseDescription.module.scss";

const CourseDescription: React.FunctionComponent<{
  course: ICourseState;
}> = ({ course }): ReactElement => {
  const CourseLead = withShortcodes({
    Content: forwardRef((props, ref) => (
      <template
        {...props}
        ref={ref}
        dangerouslySetInnerHTML={{ __html: course.description }}
      />
    )),
  });

  const CourseSuitableFor = withShortcodes({
    Content: forwardRef((props, ref) => (
      <template
        {...props}
        ref={ref}
        dangerouslySetInnerHTML={{ __html: course.suitableFor }}
      />
    )),
  });

  const CourseResult = withShortcodes({
    Content: forwardRef((props, ref) => (
      <template
        {...props}
        ref={ref}
        dangerouslySetInnerHTML={{ __html: course.learningResult }}
      />
    )),
  });

  return (
    <section className={styles["course-description"]}>
      <h2 className={styles["course-description__title"]}>Описание курса</h2>
      {course.description && (
        <div className={styles["course-description__lead"]}>
          <CourseLead />
        </div>
      )}
      {(course.suitableFor || course.learningResult) && (
        <div className={styles["course-description__additional-info"]}>
          {course.suitableFor && (
            <div className={styles["course-description__audience"]}>
              <h3 className={styles["course-description__subtitle"]}>
                Кому подойдёт
              </h3>
              <p>
                <CourseSuitableFor />
              </p>
            </div>
          )}
          {course.learningResult && (
            <div className={styles["course-description__result"]}>
              <h3 className={styles["course-description__subtitle"]}>
                Чему вы научитесь
              </h3>
              <p>
                <CourseResult />
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default CourseDescription;
