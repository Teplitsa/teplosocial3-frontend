import { ReactElement } from "react";
import styles from "./SkeletonCard.module.scss";

const SkeletonCard: React.FunctionComponent = (): ReactElement => {
  return <div className={styles["skeleton-card"]} />;
};

export default SkeletonCard;
