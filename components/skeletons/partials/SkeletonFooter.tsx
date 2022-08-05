import { ReactElement } from "react";
import styles from "./SkeletonFooter.module.scss";

const SkeletonFooter: React.FunctionComponent = (): ReactElement => {
  return <footer className={styles["skeleton-footer"]} />;
};

export default SkeletonFooter;
