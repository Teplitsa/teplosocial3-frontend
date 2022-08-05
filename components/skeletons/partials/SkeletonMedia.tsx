import { ReactElement, CSSProperties } from "react";
import styles from "./SkeletonMedia.module.scss";

const SkeletonMedia: React.FunctionComponent<CSSProperties> = ({
  children,
  ...style
}): ReactElement => {
  return <div className={styles["skeleton-media"]} {...{ style }} />;
};

export default SkeletonMedia;
