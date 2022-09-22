import { ReactElement } from "react";
import * as _ from "lodash";
import {
  useStoreActions,
  useStoreState,
} from "../../../../model/helpers/hooks";

import InclusiveComponents from "../../../../inclusive-components/inclusive-components";

import styles from "./AnswerChoice.module.scss";

const { InputRadio } = InclusiveComponents;

interface IAnswerMultipleProps {
  style?: "borderedBox" | "fullfilledBox";
}

const AnswerSingle: React.FunctionComponent<IAnswerMultipleProps> = ({
  style = "borderedBox",
}): ReactElement => {
  const question = useStoreState(
    (state) => state.components.blockPage.quiz.activeQuestion
  );
  const userAnswers = useStoreState(
    (state) => state.components.blockPage.quiz.userAnswers
  );
  const setUserAnswer = useStoreActions(
    (actions) => actions.components.blockPage.quiz.setUserAnswer
  );

  return (
    <>
      {question.answerData.map((answer) => {
        const isSelected =
          _.get(userAnswers, question.id, []).findIndex(
            (v) => v === answer.answer
          ) >= 0;

        return (
          <div
            key={`InputRadio-${question.id}-Answer${answer.answer}`}
            className={
              isSelected
                ? style === "borderedBox"
                  ? styles.choiceOptionSelected
                  : styles.choiceOptionSelected_fullfilled
                : styles.choiceOption
            }
          >
            <InputRadio
              label={answer.answer}
              name={`question_${question.id}`}
              value={answer.answer}
              checked={isSelected}
              onChange={(event) => {
                setUserAnswer({
                  questionId: question.id,
                  answerValue: answer.answer,
                });
              }}
            />
          </div>
        );
      })}
    </>
  );
};

export default AnswerSingle;
