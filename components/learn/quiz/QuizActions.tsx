import { ReactElement, useEffect, useContext, useRef, useState, MouseEvent } from "react";
import { useRouter } from "next/router";
import * as _ from "lodash";
import { useStoreActions, useStoreState } from "../../../model/helpers/hooks";

import InclusiveComponents from "../../../inclusive-components/inclusive-components";

import styles from './QuizActions.module.scss';

const {
  Button,
} = InclusiveComponents;

import { courseActions } from "model/learn/course-model";

const QuizActions: React.FunctionComponent<{
  completeBlockDoneCallback,
  setActionStartLoadingBlock,
}> = ({
  completeBlockDoneCallback,
  setActionStartLoadingBlock,
}): ReactElement => {
  const router = useRouter();
  const user = useStoreState(state => state.session.user);
  const isLoggedIn = useStoreState(state => state.session.isLoggedIn);
  const activeQuestionIndex = useStoreState(state => state.components.blockPage.quiz.activeQuestionIndex);
  const initQuizPassingState = useStoreActions(actions => actions.components.blockPage.quiz.initPassingState);
  const question = useStoreState(state => state.components.blockPage.quiz.activeQuestion);
  const questions = useStoreState(state => state.components.blockPage.quiz.questions);
  const setActiveQuestionIndex = useStoreActions(actions => actions.components.blockPage.quiz.setActiveQuestionIndex);
  const addAnsweredQuestion = useStoreActions(actions => actions.components.blockPage.quiz.addAnsweredQuestion);
  const startQuizByUser = useStoreActions(actions => actions.components.blockPage.quiz.startQuizByUser);
  const checkQuizUserAnswers = useStoreActions(actions => actions.components.blockPage.quiz.checkQuizUserAnswers);
  const completeQuizByUser = useStoreActions(actions => actions.components.blockPage.quiz.completeQuizByUser);
  const quiz = useStoreState(state => state.components.blockPage.quiz);
  const block = useStoreState(state => state.components.blockPage.block);
  const module = useStoreState(state => state.components.blockPage.module);
  const answeredQuestions = useStoreState(state => state.components.blockPage.quiz.answeredQuestions);
  const isQuizCompleted = useStoreState(state => state.components.blockPage.quiz.isCompleted);
  const wrongAnswersCount = useStoreState(state => state.components.blockPage.quiz.wrongAnswersCount);
  const completeBlock = useStoreActions(actions => actions.components.blockPage.block.completeBlockByUser);
  const isLastQuestion = activeQuestionIndex + 1 >= questions.length;

  // adaptest
  const loadModuleListByCourseCompletedByAdaptest = useStoreActions(actions => actions.components.blockPage.course.loadModuleListByCourseCompletedByAdaptest);
  const course = useStoreState(state => state.components.blockPage.course);

  useEffect(() => {
    if(!isQuizCompleted || (wrongAnswersCount > 0 && !quiz.isAdaptest)) {
      return;
    }

    completeQuizByUser({quiz, block, module, user, doneCallback: quizCompletedByUserHandler});
  }, [isQuizCompleted, block, wrongAnswersCount]);

  useEffect(() => {
    if(_.isEmpty(answeredQuestions)) {
      return;
    }

    let notAnsweredQuestionIndex = -1;
    if(questions.length > answeredQuestions.length) {
      // console.log("answeredQuestions:", answeredQuestions);
      // console.log("questions:", questions.map(q => q.id));
      notAnsweredQuestionIndex = questions.findIndex(q => {
        // console.log("q.id:", q.id);
        const findResult = answeredQuestions.find(answeredQuestionId => answeredQuestionId === q.id);
        // console.log("findResult:", findResult);
        return findResult === undefined;
      });
      // console.log("notAnsweredQuestionIndex:", notAnsweredQuestionIndex);
    }

    if(notAnsweredQuestionIndex >= 0) {
      setActiveQuestionIndex(notAnsweredQuestionIndex);
    }
    else {
      checkQuizUserAnswers({quiz, module, user, doneCallback: quizUserAnswersCheckedHandler});
    }
  }, [questions, answeredQuestions]);

  // console.log("isQuizCompleted:", isQuizCompleted);
  // console.log("wrongAnswersCount:", wrongAnswersCount);
  // console.log("block.isCompleted:", block.isCompleted);

  return (
    <div className={styles.actions}>

      {isLoggedIn && 
        <>
          {!(isQuizCompleted || block.isCompleted) &&
            <Button
              className="btn_secondary"
              aria-label={`Ответить на вопрос ${question.title.rendered} позже`}
              onClick={() => {
                if(isLastQuestion) {
                  if(block.nextUncompletedBlockSlug) {
                    router.push(`/blocks/${block.nextUncompletedBlockSlug}`);
                  }
                  else {
                    router.push(`/courses/${block.courseSlug}`);
                  }
                }
                else {
                  setActiveQuestionIndex(quiz.activeQuestionIndex + 1);
                }
              }}
            >
              Ответить позже
            </Button>
          }

          {!(isQuizCompleted || block.isCompleted) &&
            <Button
              className="btn_primary"
              aria-label={`Ответить на вопрос ${question.title.rendered}`}
              onClick={() => {
                if(_.isEmpty(answeredQuestions)) {
                  startQuizByUser({quiz, module, user, doneCallback: quizStartedHandler});
                }
                addAnsweredQuestion(question.id);
              }}
            >
              {question.answerType === "essay" ? "Отправить" : "Ответить"}
            </Button>
          }

          {!isQuizCompleted && block.isCompleted &&
            <Button
              className="btn_secondary"
              aria-label={`Перейти к следующему блоку`}
              onClick={() => {
                if(block.nextUncompletedBlockSlug) {
                  router.push(`/blocks/${block.nextUncompletedBlockSlug}`);
                }
                else if(block.nextBlockSlug) {
                  router.push(`/blocks/${block.nextBlockSlug}`);
                }
                else {
                  router.push(`/courses/${block.courseSlug}`);
                }
              }}
            >
              Дальше
            </Button>
          }
          
          {(isQuizCompleted && (wrongAnswersCount === 0 || quiz.isAdaptest)) &&
            <Button
              className="btn_primary"
              aria-label={`Продолжить`}
              onClick={() => {
                // console.log("block: ", block);
                if(!block.isCompleted && !quiz.isAdaptest) {
                  setActionStartLoadingBlock(true);
                  // console.log("completeBlock...");
                  completeBlock({block, user, doneCallback: completeBlockDoneCallback});
                }
                // else if(!!block.nextBlockSlug) {
                //   router.push(`/blocks/${block.nextBlockSlug}`);
                // }
                else {
                  router.push(`/courses/${block.courseSlug}`);
                }
              }}
            >
              Продолжить
            </Button>
          }

          {isQuizCompleted && (wrongAnswersCount > 0 && !quiz.isAdaptest) && !block.isCompleted &&
            <>
              <Button
                className="btn_secondary"
                aria-label={`Пройти тест ${quiz.title.rendered} позже`}
                onClick={() => {
                  if(block.nextUncompletedBlockSlug) {
                    router.push(`/blocks/${block.nextUncompletedBlockSlug}`);
                  }
                  else {
                    router.push(`/courses/${block.courseSlug}`);
                  }
                }}
              >
                Пройти позже
              </Button>

              <Button
                className="btn_primary"
                aria-label={`Попробовать пройти тест ${quiz.title.rendered} еще раз`}
                onClick={() => {
                  initQuizPassingState();
                }}
              >
                Пройти заново
              </Button>
            </>
          }
        </>      
      }

      {!isLoggedIn &&
      <div className={styles.actions}>
        {!isLastQuestion &&
          <Button
            className="btn_secondary"
            aria-label={`Перейти к следующему вопросу`}
            onClick={() => {
              setActiveQuestionIndex(quiz.activeQuestionIndex + 1);
            }}
          >
            Дальше
          </Button>
          }
        {isLastQuestion && !!block.nextBlockSlug &&
          <Button
            className="btn_secondary"
            aria-label={`Перейти к следующему блоку`}
            onClick={() => {
              router.push(`/blocks/${block.nextBlockSlug}`);
            }}
          >
            Дальше
          </Button>
        }
        {isLastQuestion && !block.nextBlockSlug &&
          <Button
            className="btn_secondary"
            aria-label={`Вернуться к программе трека`}
            onClick={() => {
              router.push(`/tracks/${block.trackSlug}`);
            }}
          >
            Дальше
          </Button>
        }
      </div>      
      }
    </div>
  );

  function quizStartedHandler(params) {
    // console.log("quizStartedHandler:", params);
  }

  function quizUserAnswersCheckedHandler(params) {
    // console.log("quizUserAnswersCheckedHandler:", params);
  }

  function quizCompletedByUserHandler(params) {
    // console.log("quizCompletedByUserHandler:", params);

    if(!isQuizCompleted || !quiz.isAdaptest) {
      return;
    }

    loadModuleListByCourseCompletedByAdaptest({course});
    // setCheckedAnswers({});
  }
};

export default QuizActions;
