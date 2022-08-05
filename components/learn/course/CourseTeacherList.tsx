import { ReactElement } from "react";
import { useStoreState } from "../../../model/helpers/hooks";
import { getDeclension } from "../../../utilities/utilities";
import styles from "./CourseTeacherList.module.scss";

const CourseTeacherList: React.FunctionComponent = (): ReactElement => {
  const teacherList = useStoreState(
    (state) => state.components.coursePage.course.teacherList
  );

  if (!teacherList?.length) {
    return null;
  }

  return (
    <section className={styles["course-teacher"]}>
      <h2 className={styles["course-teacher__title"]}>
        {getDeclension({
          count: teacherList.length,
          caseOneItem: "Преподаватель",
          caseTwoThreeFourItems: "Преподаватели",
          restCases: "Преподаватели",
        })}{" "}
        курса
      </h2>
      <ul className={styles["course-teacher__list"]}>
        {teacherList.map(({ id, avatar, name, resume }) => {
          return (
            <li
              className={styles["course-teacher__item"]}
              key={`CourseTeacherListItem-${id}`}
            >
              <figure className={styles["course-teacher__avatar-wrapper"]}>
                {avatar && (
                  <img
                    className={styles["course-teacher__avatar"]}
                    src={avatar}
                    alt={`Преподаватель ${name}`}
                  />
                )}
              </figure>
              <div className={styles["course-teacher__entry"]}>
                <h3 className={styles["course-teacher__name"]}>{name}</h3>
                <div
                  className={styles["course-teacher__resume"]}
                  dangerouslySetInnerHTML={{ __html: resume }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default CourseTeacherList;
