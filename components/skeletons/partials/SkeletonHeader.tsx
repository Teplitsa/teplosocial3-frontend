import { ReactElement } from "react";
import styles from "./SkeletonHeader.module.scss";

const SkeletonHeader: React.FunctionComponent = (): ReactElement => {
  return (
    <header className={styles["skeleton-header"]}>
      <div className={styles["skeleton-header__inner"]}>
        <div className={styles["skeleton-header__logo"]} />
        <div className={styles["skeleton-header__progress-bar"]} />
      </div>
    </header>
  );
};

export default SkeletonHeader;
