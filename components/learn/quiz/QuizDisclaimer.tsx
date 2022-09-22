import { ReactElement } from "react";
import styles from "./QuizDisclaimer.module.scss";

interface IQuizDisclaimer {
  title?: string;
  message: string;
}

const QuizDisclaimer: React.FunctionComponent<IQuizDisclaimer> = ({
  title = "Дисклеймер.",
  message,
}): ReactElement => {
  return (
    <div className={styles.disclaimer}>
      <span className={styles.disclaimer__title}>{title}</span>
      {message}
    </div>
  );
};

export default QuizDisclaimer;
