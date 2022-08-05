import { ReactElement } from "react";
import SkeletonCard from "./SkeletonCard";
import { COURSES_PER_PAGE } from "../../../const";
import { convertObjectToClassName } from "../../../utilities/utilities";
import styles from "./SkeletonCardList.module.scss";

const SkeletonCardList: React.FunctionComponent<{ limit?: number }> = ({
  limit,
}): ReactElement => {
  return (
    <div
      className={convertObjectToClassName({
        [styles["skeleton-card-list"]]: true,
        [styles[`skeleton-card-list_count-${limit ?? COURSES_PER_PAGE}`]]: Boolean(
          styles[`skeleton-card-list_count-${limit ?? COURSES_PER_PAGE}`]
        ),
      })}
    >
      {Array(limit ?? COURSES_PER_PAGE)
        .fill(null)
        .map((_, i) => (
          <SkeletonCard key={`SkeletonCard-${i}`} />
        ))}
    </div>
  );
};

export default SkeletonCardList;
