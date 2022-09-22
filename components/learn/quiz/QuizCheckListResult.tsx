import { ReactElement } from "react";
import styles from "./QuizCheckListResult.module.scss";
import { convertObjectToClassName } from "../../../utilities/utilities";

interface IQuizCheckListResult {
  title: string;
  description: string;
  isActive: boolean;
}

const QuizCheckListResult: React.FunctionComponent<IQuizCheckListResult> = ({
  title,
  description,
  isActive,
}): ReactElement => {
  return (
    <div
      className={convertObjectToClassName({
        [styles["checklist-result"]]: true,
        [styles["checklist-result_active"]]: isActive,
      })}
    >
      {isActive && (
        <div className={styles["checklist-result__label"]}>Ваш результат</div>
      )}
      <h3 className={styles["checklist-result__title"]}>{title}</h3>
      <div className={styles["checklist-result__description"]}>
        {description}
      </div>
    </div>
  );
};

export default QuizCheckListResult;
