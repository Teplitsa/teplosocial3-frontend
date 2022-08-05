import { ReactElement } from "react";

import imageRateStarFilled from "../../../../assets/img/rate-star-filled.svg";
import imageRateStar from "../../../../assets/img/rate-star.svg";

const RateCourseStar: React.FunctionComponent<{
  score: number,
  hoverRating: number,
  onClick: (number) => void,
  setHoverRating: (number) => void,
}> = ({
  score,
  hoverRating,
  onClick,
  setHoverRating,
}): ReactElement => {

  function onMouseOverStar() {
    setHoverRating(score);
  }

  return (
    <img
      src={hoverRating >= score ? imageRateStarFilled : imageRateStar} 
      onMouseOver={onMouseOverStar} 
      onClick={() => {
        onClick(score);
      }}
    />
  );
};

export default RateCourseStar;
