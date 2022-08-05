import { ReactElement, useState } from "react";
import * as _ from "lodash";

import {
  ICourseState,
} from "../../../../model/model.typing";
import InclusiveComponents from "../../../../inclusive-components/inclusive-components";
import RateCourseStar from "./RateCourseStar"

import styles from './CourseReview.module.scss';

const {
  Button,
} = InclusiveComponents;

const RateCourse: React.FunctionComponent<{
  course: ICourseState, 
  closeModal: () => void,
  onSubmit: (number) => void,
}> = ({
  course,
  closeModal,
  onSubmit,
}): ReactElement => {

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  function onMouseLeaveStars() {
    setHoverRating(rating);
  }

  return (
    <div className={styles.modalContent}>
      <p>
        Ваша оценка поможет нам стать лучше
      </p>
      <div className={styles.ratingStars} onMouseLeave={onMouseLeaveStars}>
        {[1, 2, 3, 4, 5].map((score) => <RateCourseStar 
          key={`RateStar${score}`}
          score={score} 
          hoverRating={hoverRating}
          onClick={setRating} 
          setHoverRating={setHoverRating} 
        />)}
      </div>
      <div className={styles.ratingText}>
        Отметье нужное количество звезд
      </div>
      <div className={styles.modalActions}>
        <Button className={`btn_secondary ${rating === 0 ? "rate-disabled" : ""}`} onClick={() => {
          onSubmit(rating);
        }}>
          Оценить
        </Button>
      </div>
    </div>
  );
};

export default RateCourse;
