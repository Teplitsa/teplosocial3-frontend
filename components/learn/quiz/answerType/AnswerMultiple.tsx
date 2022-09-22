import { ReactElement } from "react";
import * as _ from "lodash";
import {
  useStoreActions,
  useStoreState,
} from "../../../../model/helpers/hooks";

import InclusiveComponents from "../../../../inclusive-components/inclusive-components";

import styles from "./AnswerChoice.module.scss";

const { InputCheckbox } = InclusiveComponents;

interface IAnswerMultipleProps {
  style?: "borderedBox" | "fullfilledBox";
}

const AnswerMultiple: React.FunctionComponent<IAnswerMultipleProps> = ({
  style = "borderedBox",
}): ReactElement => {
  const question = useStoreState(
    (state) => state.components.blockPage.quiz.activeQuestion
  );
  const userAnswers = useStoreState(
    (state) => state.components.blockPage.quiz.userAnswers
  );
  const addUserAnswer = useStoreActions(
    (actions) => actions.components.blockPage.quiz.addUserAnswer
  );
  const deleteUserAnswer = useStoreActions(
    (actions) => actions.components.blockPage.quiz.deleteUserAnswer
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
            key={`Question${question.id}Answer${answer.answer}`}
            className={
              isSelected
                ? style === "borderedBox"
                  ? styles.choiceOptionSelected
                  : styles.choiceOptionSelected_fullfilled
                : styles.choiceOption
            }
          >
            <InputCheckbox
              label={answer.answer}
              name={`question_${question.id}`}
              value={answer.answer}
              checked={isSelected}
              onChange={(event) => {
                isSelected
                  ? deleteUserAnswer({
                      questionId: question.id,
                      answerValue: answer.answer,
                    })
                  : addUserAnswer({
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

export default AnswerMultiple;
