import { ReactElement, useState } from "react";
import * as _ from "lodash";

import {
  ICourseState,
  ICourseReview,
} from "../../../../model/model.typing";
import InclusiveComponents from "../../../../inclusive-components/inclusive-components";

import styles from './CourseReview.module.scss';

const {
  Button,
  TextArea,
} = InclusiveComponents;

const CourseReviewForm: React.FunctionComponent<{
  course: ICourseState, 
  courseReview: ICourseReview,
  closeModal: () => void,
  onSubmit: (ICourseReview) => void,
}> = ({
  course,
  courseReview,
  closeModal,
  onSubmit,
}): ReactElement => {

  const [reviewText, setReviewText] = useState("");

  return (
    <div className={styles.modalContent}>
      <p>
        Ваш отзыв поможет нам стать лучше
      </p>
      <div className={styles.reviewText}>
        <TextArea
          placeholder={"Напиши ваш отзыв"}
          value={reviewText}
          onChange={(event) => {
            setReviewText(event.target.value);
          }}
        />
      </div>
      <div className={styles.modalActions}>
        <Button className="btn_secondary" onClick={() => {
          onSubmit({
            ...courseReview,
            text: reviewText,
          });
        }}>
          Отправить
        </Button>
        <Button className="btn_reset" onClick={() => {
          onSubmit(courseReview);
        }}>
          Пропустить
        </Button>
      </div>
    </div>
  );
};

export default CourseReviewForm;
