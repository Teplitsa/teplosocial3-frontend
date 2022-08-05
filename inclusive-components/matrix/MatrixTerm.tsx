import { ReactElement } from "react";
import { IMatrixTerm } from "../inclusive-components.typing";
import styles from "./Matrix.module.scss";

const MatrixTerm: React.FunctionComponent<IMatrixTerm> = ({
  order,
  text,
}): ReactElement => {
  return (
    <div style={{ order }} className={styles["matrix-term"]}>
      {text}
    </div>
  );
};

export default MatrixTerm;
