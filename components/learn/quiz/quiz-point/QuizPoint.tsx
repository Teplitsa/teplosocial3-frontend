import { ReactElement } from "react";
import styles from "./QuizPoint.module.scss";

interface IQuizPoint {
  text: string;
}

const QuizPoint: React.FunctionComponent<IQuizPoint> = ({
  text,
}): ReactElement => {
  return (
    <div className={styles.point}>
      {text}
    </div>
  );
};

export default QuizPoint;
