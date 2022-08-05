import { ReactElement } from "react";
import SkeletonHeader from "../skeletons/partials/SkeletonHeader";
import SkeletonFooter from "../skeletons/partials/SkeletonFooter";
import styles from "./MainSkeleton.module.scss";

const MainSkeleton: React.FunctionComponent = ({ children }): ReactElement => {
  return (
    <main className={styles["skeleton-main"]}>
      <SkeletonHeader />
      {children}
      <SkeletonFooter />
    </main>
  );
};

export default MainSkeleton;
