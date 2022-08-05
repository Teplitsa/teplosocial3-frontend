import { ReactElement } from "react";
import styles from './Loader.module.scss'

const Loader: React.FunctionComponent = (): ReactElement => {
  return (
    <div className={styles.loader}>
      <div />
      <div />
      <div />
      <div />
    </div>
  );
};

export default Loader;
