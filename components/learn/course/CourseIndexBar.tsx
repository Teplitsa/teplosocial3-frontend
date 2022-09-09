import { ReactElement, useEffect, useState, MouseEvent } from "react";
import * as _ from "lodash";
import Link from "next/link";

import { useStoreState, useStoreActions } from "../../../model/helpers/hooks";
import { ICourseState } from "../../../model/model.typing";
import CourseIndex from "./CourseIndex";

import styles from "./CourseIndexBar.module.scss";

import imageCourseIndexOpen from "../../../assets/img/course-index-open.svg";
import imageCourseIndexClose from "../../../assets/img/course-index-close.svg";

const CourseIndexBar: React.FunctionComponent<{ course: ICourseState }> = ({
  course,
}): ReactElement => {
  const block = useStoreState((state) => state.components.blockPage.block);
  const setIsCourseIndexOpen = useStoreActions(
    (actions) => actions.components.blockPage.setIsCourseIndexOpen
  );
  // const isCourseIndexOpen = true;
  const isCourseIndexOpen = useStoreState(
    (state) => state.components.blockPage.isCourseIndexOpen
  );

  function IndexToggleButton() {
    return (
      <div
        className={isCourseIndexOpen ? styles.barOpen : styles.bar}
        onClick={() => {
          setIsCourseIndexOpen(!isCourseIndexOpen);
        }}
      >
        <span>Программа курса</span>
        <img
          src={isCourseIndexOpen ? imageCourseIndexClose : imageCourseIndexOpen}
          onClick={() => {
            setIsCourseIndexOpen(!isCourseIndexOpen);
          }}
        />
      </div>
    );
  }

  console.log("ccc", course);

  return (
    <div className={styles.indexWrapper}>
      {isCourseIndexOpen ? (
        <div className={styles.barOpen} />
      ) : (
        <IndexToggleButton />
      )}

      {isCourseIndexOpen && (
        <div className={styles.indexContent}>
          <IndexToggleButton />
          <div className={styles.indexListWrapper}>
            <CourseIndex course={course} block={block} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseIndexBar;
