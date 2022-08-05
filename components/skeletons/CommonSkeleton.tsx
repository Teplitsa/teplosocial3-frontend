import { ReactElement } from "react";
import styles from "./CommonSkeleton.module.scss";

const CommonSkeleton: React.FunctionComponent = (): ReactElement => {
  return (
    <div className={styles["skeleton-common"]}>
      <div className={styles["skeleton-common__hero"]}>
        <div className={styles["skeleton-common__hero-title"]} />
        <div
          className={`${styles["skeleton-common__hero-paragraph"]} ${styles["skeleton-common__hero-paragraph_long"]}`}
        />
        <div className={`${styles["skeleton-common__hero-paragraph"]} ${styles["skeleton-common__hero-paragraph_short"]}`} />
      </div>
      <div className={styles["skeleton-common__section"]} />
    </div>
  );
};

export default CommonSkeleton;
