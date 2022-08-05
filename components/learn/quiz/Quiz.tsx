import {
  ReactElement,
  useEffect,
  useContext,
  useRef,
  useState,
  MouseEvent,
} from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import * as _ from "lodash";
import { useStoreActions, useStoreState } from "../../../model/helpers/hooks";

import { IBlockState, IQuizState } from "../../../model/model.typing";

import Loader from "../../Loader";
import QuizProgress from "./QuizProgress";
import QuizActions from "./QuizActions";
import AnswerSingle from "./answerType/AnswerSingle";
import AnswerMultiple from "./answerType/AnswerMultiple";
import AnswerMatrix from "./answerType/AnswerMatrix";
import AnswerEssayText from "./answerType/AnswerEssayText";
import AnswerEssayUpload from "./answerType/AnswerEssayUpload";

import styles from "./Quiz.module.scss";
import stylesBlock from "../block/BlockContent.module.scss";

const Quiz: React.FunctionComponent<{
  completeBlockDoneCallback;
  setActionStartLoadingBlock;
}> = ({
  completeBlockDoneCallback,
  setActionStartLoadingBlock,
}): ReactElement => {
  const user = useStoreState((state) => state.session.user);
  const quiz = useStoreState((state) => state.components.blockPage.quiz);
  const initQuizPassingState = useStoreActions(
    (actions) => actions.components.blockPage.quiz.initPassingState
  );
  const question = useStoreState(
    (state) => state.components.blockPage.quiz.activeQuestion
  );
  const [actionStartLoading, setActionStartLoading] = useState(false);
  const isQuizCompleted = useStoreState(
    (state) => state.components.blockPage.quiz.isCompleted
  );
  const isQuizPassed = useStoreState(
    (state) => state.components.blockPage.quiz.isPassed
  );
  const answersToBeGradedCount = useStoreState(
    (state) => state.components.blockPage.quiz.answersToBeGradedCount
  );
  const wrongAnswersCount = useStoreState(
    (state) => state.components.blockPage.quiz.wrongAnswersCount
  );
  const block = useStoreState((state) => state.components.blockPage.block);
  const course = useStoreState((state) => state.components.blockPage.course);
  const moduleListByAdaptest = useStoreState((state) => {
    const { moduleListByAdaptest } = state.components.blockPage.course;

    return quiz.isAdaptestPassedRepeatedly
      ? moduleListByAdaptest?.filter((module) => {
          return /^Итоговое задание/.test(module.title.rendered) === false;
        })
      : moduleListByAdaptest;
  });
  const moduleListCompletedByAdaptest = useStoreState(
    (state) => state.components.blockPage.course.moduleListCompletedByAdaptest
  );

  useEffect(() => {
    initQuizPassingState();
  }, []);

  useEffect(() => {
    if (!isQuizCompleted || !quiz.isAdaptest) {
      return;
    }

    setActionStartLoading(true);
  }, [isQuizCompleted]);

  useEffect(() => {
    setActionStartLoading(false);
  }, [moduleListCompletedByAdaptest]);

  if (!question) {
    return null;
  }

  return (
    <>
      {!!_.get(quiz, "id") &&
        !block.isCompleted &&
        !!quiz.questions &&
        quiz.questions.length > 1 &&
        !(isQuizCompleted && quiz.isAdaptest) && (
          <div className={styles.quizProgress}>
            <QuizProgress />
          </div>
        )}

      <div className={styles.block}>
        <div className={styles.title}>
          <h2 dangerouslySetInnerHTML={{ __html: quiz.title.rendered }} />
        </div>

        {!(isQuizCompleted || block.isCompleted) && (
          <>
            {!_.isEmpty(_.trim(question.question)) && (
              <div
                className={styles.questionContentText}
                dangerouslySetInnerHTML={{ __html: question.question }}
              />
            )}
          </>
        )}

        {actionStartLoading && (
          <div className={styles.actionsLoader}>
            <Loader />
          </div>
        )}

        {!actionStartLoading && (isQuizCompleted || block.isCompleted) && (
          <>
            {quiz.isAdaptest && (
              <div className={styles.adaptestCompleted}>
                {moduleListCompletedByAdaptest?.length > 0 && (
                  <>
                    {quiz.isAdaptestPassedRepeatedly && (
                      <>
                        {moduleListByAdaptest.length ===
                          moduleListCompletedByAdaptest.length && (
                          <div>
                            <h4>Поздравляем, вы проверили свои знания</h4>
                            <p>
                              Вы замечательно усвоили материал. Выберите новый
                              курс себе по вкусу в нашем{" "}
                              <Link href="/catalog">
                                <a>каталоге</a>
                              </Link>
                              .
                            </p>
                          </div>
                        )}
                        {moduleListByAdaptest.length !==
                          moduleListCompletedByAdaptest.length && (
                          <div>
                            <h4>Поздравляем, вы проверили свои знания</h4>
                            <p>
                              Мы советуем вам повторить эти модули и вернуться к
                              тесту через пару месяцев.
                            </p>
                            <ul>
                              {moduleListByAdaptest
                                .filter(
                                  ({ slug }) =>
                                    moduleListCompletedByAdaptest.findIndex(
                                      ({ slug: slugCompleted }) =>
                                        slug === slugCompleted
                                    ) === -1
                                )
                                .map((module) => {
                                  return (
                                    <li
                                      key={`CompleteModuleByAdaptest-${module.slug}`}
                                    >
                                      <Link href={`/modules/${module.slug}`}>
                                        <a>{module.title.rendered}</a>
                                      </Link>
                                    </li>
                                  );
                                })}
                            </ul>
                          </div>
                        )}
                      </>
                    )}
                    {!quiz.isAdaptestPassedRepeatedly && (
                      <div>
                        <h4>Поздравляем, вы завершили адаптационный тест.</h4>
                        <p>По его результатам мы зачтём вам эти модули:</p>
                        <ul>
                          {moduleListCompletedByAdaptest.map((module) => {
                            return (
                              <li
                                key={`CompleteModuleByAdaptest-${module.slug}`}
                              >
                                <Link href={`/modules/${module.slug}`}>
                                  <a>{module.title.rendered}</a>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                        <p>
                          В любой момент вы можете вернуться к ним и проверить
                          свои знания.
                        </p>
                      </div>
                    )}
                  </>
                )}
                {moduleListCompletedByAdaptest?.length === 0 && (
                  <>
                    {quiz.isAdaptestPassedRepeatedly && (
                      <div>
                        <h4>Поздравляем, вы проверили свои знания</h4>
                        <p>
                          Мы советуем вам повторить эти модули и вернуться к
                          тесту через пару месяцев.
                        </p>
                        <ul>
                          {moduleListByAdaptest
                            .filter(
                              ({ slug }) =>
                                moduleListCompletedByAdaptest.findIndex(
                                  ({ slug: slugCompleted }) =>
                                    slug === slugCompleted
                                ) === -1
                            )
                            .map((module) => {
                              return (
                                <li
                                  key={`CompleteModuleByAdaptest-${module.slug}`}
                                >
                                  <Link href={`/modules/${module.slug}`}>
                                    <a>{module.title.rendered}</a>
                                  </Link>
                                </li>
                              );
                            })}
                        </ul>
                      </div>
                    )}
                    {!quiz.isAdaptestPassedRepeatedly && (
                      <div>
                        <h4>Вы завершили адаптационный тест.</h4>
                        <p>
                          Ни один модуль не зачтён. Хорошая новость в том, что в
                          этом курсе для вас будет много нового и полезного!
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {!quiz.isAdaptest && (
              <>
                <h4>
                  Верные ответы {quiz.questions.length - wrongAnswersCount} из{" "}
                  {quiz.questions.length}
                </h4>
                {wrongAnswersCount > 0 && (
                  <h5>Попробуйте ещё раз. У вас всё получится!</h5>
                )}
                {wrongAnswersCount === 0 && (
                  <h5>Вот это успех! Двигаемся дальше.</h5>
                )}
              </>
            )}
          </>
        )}

        {!actionStartLoading &&
          !!question &&
          !(isQuizCompleted || block.isCompleted) && (
            <div>
              {question.answerType === "multiple" && <AnswerMultiple />}
              {question.answerType === "matrix_sort_answer" && <AnswerMatrix />}
              {question.answerType === "single" && <AnswerSingle />}
              {question.answerType === "essay" &&
                _.get(question, "answerData.0.gradedType") === "text" && (
                  <AnswerEssayText />
                )}
              {question.answerType === "essay" &&
                _.get(question, "answerData.0.gradedType") === "upload" && (
                  <AnswerEssayUpload />
                )}
            </div>
          )}
      </div>

      {!actionStartLoading &&
        (_.get(question, "answerType", "") !== "essay" || isQuizCompleted) && (
          <QuizActions
            completeBlockDoneCallback={completeBlockDoneCallback}
            setActionStartLoadingBlock={setActionStartLoadingBlock}
          />
        )}
    </>
  );
};

export default Quiz;
