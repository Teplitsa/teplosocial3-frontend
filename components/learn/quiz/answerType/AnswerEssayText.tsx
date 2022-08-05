import { ReactElement } from "react";
import * as _ from "lodash";
import { useStoreActions, useStoreState } from "../../../../model/helpers/hooks";

import QuizActions from "../QuizActions";
import InclusiveComponents from "../../../../inclusive-components/inclusive-components";

import styles from './AnswerEssay.module.scss';

const {
  TextArea,
} = InclusiveComponents;

const AnswerEssayText: React.FunctionComponent = (): ReactElement => {
  const question = useStoreState(state => state.components.blockPage.quiz.activeQuestion);
  const userAnswers = useStoreState(state => state.components.blockPage.quiz.userAnswers);
  const setUserAnswer = useStoreActions(actions => actions.components.blockPage.quiz.setUserAnswer);

  return (
    <div className={styles.answerWrapper}>
      <div className={styles.answer}>
        <h5>Отправить задание:</h5>
        {question.answerData.map(answer => {
          return <TextArea
            key={`Question${question.id}Answer${answer.answer}`}
            label={answer.answer}
            name={`question_${question.id}`}
            value={_.get(userAnswers, question.id, [""])[0]}
            onChange={(event) => {
              setUserAnswer({questionId: question.id, answerValue: event.target.value})
            }}
          />
        })}
        {/* <QuizActions /> */}
      </div>
    </div>
  );
};

export default AnswerEssayText;
