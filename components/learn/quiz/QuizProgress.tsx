import { ReactElement, useEffect, useContext, useRef, useState, MouseEvent } from "react";
import { useRouter } from "next/router";
import * as _ from "lodash";
import { useStoreActions, useStoreState } from "../../../model/helpers/hooks";

import styles from './QuizProgress.module.scss';

import imagePoint from "../../../assets/img/quiz-progress-point.svg";
import imagePointFilled from "../../../assets/img/quiz-progress-point-filled.svg";
import imagePointError from "../../../assets/img/quiz-progress-point-error.svg";
import imagePointCurrent from "../../../assets/img/quiz-progress-point-current.svg";

const QuizProgress: React.FunctionComponent = (): ReactElement => {
  const activeQuestionIndex = useStoreState(state => state.components.blockPage.quiz.activeQuestionIndex);
  const answeredQuestions = useStoreState(state => state.components.blockPage.quiz.answeredQuestions);
  const questions = useStoreState(state => state.components.blockPage.quiz.questions);
  const setActiveQuestionIndex = useStoreActions(actions => actions.components.blockPage.quiz.setActiveQuestionIndex);
  const isQuizCompleted = useStoreState(state => state.components.blockPage.quiz.isCompleted);
  const userAnswersResult = useStoreState(state => state.components.blockPage.quiz.userAnswersResult);

  return (
    <div className={styles.bar}>
      {questions.map((q, i) => {
        const isAnswered = _.isEmpty(answeredQuestions) ? false : answeredQuestions.findIndex(aqId => aqId === q.id) >= 0;
        const isError = userAnswersResult ? userAnswersResult[q.id] === false : false;
        const isCurrent = activeQuestionIndex === i;

        return (
          <div className={styles.point} key={`QuizProgressPoint-${q.id}`}>
            <div onClick={() => {
              setActiveQuestionIndex(i);
            }}>
              {isCurrent 
                ? <img src={!isError ? imagePointCurrent : imagePointError} />
                : <img src={(isAnswered && !isError) ? imagePointFilled : (isAnswered ? imagePointError : imagePoint) } />
              }
              <div className={styles.pointText}><span className={isError ? "error" : isCurrent ? "current" : "" }>{i + 1}</span></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QuizProgress;
