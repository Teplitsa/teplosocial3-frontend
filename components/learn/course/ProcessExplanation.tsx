import { ReactElement, useState } from "react";

import styles from "./ProcessExplanation.module.scss";

import courseProcessExplanationImage1 from "../../../assets/img/course-process-explanation-1.svg";
import courseProcessExplanationImage2 from "../../../assets/img/course-process-explanation-2.svg";
import courseProcessExplanationImage3 from "../../../assets/img/course-process-explanation-3.svg";
import courseProcessExplanationImage4 from "../../../assets/img/course-process-explanation-4.svg";

const ProcessExplanation: React.FunctionComponent = (): ReactElement => {
  const [steps, setSteps] = useState([
    {
      image: courseProcessExplanationImage1,
      title: "Изучаете модуль",
      description:
        "Вы изучаете модуль в удобное время и в любой момент можете вернуться к уроку, на котором остановились.",
    },
    {
      image: courseProcessExplanationImage2,
      title: "Закрепляете знания",
      description:
        "В течение модуля выполняете тесты, которые помогут закрепить усвоенные знания.",
    },
    {
      image: courseProcessExplanationImage3,
      title: "Выполняете итоговое задание",
      description:
        "После прохождения всех модулей вас ждет итоговое задание, которое нужно отправить на проверку тьютору.",
    },
    {
      image: courseProcessExplanationImage4,
      title: "Получаете сертификат",
      description:
        "В конце вы получите сертификат об успешном прохождении курса.",
    },
  ]);

  return (
    <section className={styles.wrapper}>
      <div className={styles.box}>
        <h2 className={styles.title}>Как проходит обучение</h2>
        <div className={styles.content}>
          <div className={styles.listWrapper}>
            <div className={styles.list}>
              {steps.map((step, idx) => {
                return (
                  <div
                    className={styles.item}
                    key={`ProcessExplanation-Step-${step.title}`}
                  >
                    <img src={step.image} alt="" />
                    <h4 className={styles["item-title"]}>{`${idx + 1}. ${step.title}`}</h4>
                    <p>{step.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessExplanation;
