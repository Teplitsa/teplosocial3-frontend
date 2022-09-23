import { ReactElement, useEffect, useState } from "react";
import Link from "next/link";
import * as _ from "lodash";
import { useStoreActions, useStoreState } from "../../../model/helpers/hooks";

import { QuizTypeChecklistSettings } from "../../../model/model.typing";

import Loader from "../../Loader";
import QuizProgress from "./QuizProgress";
import QuizActions from "./QuizActions";
import QuizDisclaimer from "./QuizDisclaimer";
import QuizPoint from "./quiz-point/QuizPoint";
import QuizCheckListResult from "./QuizCheckListResult";
import AnswerSingle from "./answerType/AnswerSingle";
import AnswerMultiple from "./answerType/AnswerMultiple";
import AnswerMatrix from "./answerType/AnswerMatrix";
import AnswerEssayText from "./answerType/AnswerEssayText";
import AnswerEssayUpload from "./answerType/AnswerEssayUpload";

import {
  getDeclension,
  convertObjectToClassName,
} from "../../../utilities/utilities";

import styles from "./Quiz.module.scss";

const Quiz: React.FunctionComponent<{
  completeBlockDoneCallback;
  setActionStartLoadingBlock;
}> = ({
  completeBlockDoneCallback,
  setActionStartLoadingBlock,
}): ReactElement => {
  const [isActionsDisabled, setIsActionsDisabled] = useState<boolean>(false);
  const [answerComment, setAnswerComment] = useState<{
    type?: "success" | "error";
    message?: string;
  }>({});
  const user = useStoreState((state) => state.session.user);
  const quiz = useStoreState((state) => state.components.blockPage.quiz);
  const quizType = useStoreState(
    (state) => state.components.blockPage.quiz.quizType
  );
  const quizTypeRelatedSettings = useStoreState(
    (state) => state.components.blockPage.quiz.quizTypeRelatedSettings ?? []
  );
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
  const quizLabel =
    (quizType === "checklist" && "Чеклист") || (quizType === "quiz" && "Квиз");
  const disclaimerMessage = ["checklist"].includes(quizType)
    ? "Это не соревнование «кто наберет больше баллов». Может быть, вы не согласитесь с какими-то утверждениями, потому что у вас есть собственная практика, rоторая работает для вас эффективнее. И это нормально. Отнеситесь к упражнению как к чеклисту, который обращает ваше внимание на разные аспекты, связанные с темой паролей. Итак, поехали."
    : "";
  const pointText = ["checklist", "quiz"].includes(quizType)
    ? (quizType === "checklist" &&
        "В этом вопросе может быть больше одного варианта ответа") ||
      "В этом вопросе может быть только один вариант ответа"
    : "";
  const userPoints = _.get(
    quiz,
    `checkedAnswers.${(quiz.answeredQuestions ?? [])[0]}.p`,
    null
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

  useEffect(() => {
    setIsActionsDisabled(["quiz"].includes(quiz.quizType));
    setAnswerComment({});
  }, [question]);

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
        {!["checklist", "quiz"].includes(quiz.quizType) && (
          <div className={styles.title}>
            <h2 dangerouslySetInnerHTML={{ __html: quiz.title.rendered }} />
          </div>
        )}

        {["checklist", "quiz"].includes(quiz.quizType) && (
          <div className={styles.quizLabel}>{quizLabel}</div>
        )}

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

        {!(isQuizCompleted || block.isCompleted) && disclaimerMessage && (
          <QuizDisclaimer {...{ message: disclaimerMessage }} />
        )}

        {!(isQuizCompleted || block.isCompleted) && pointText && (
          <QuizPoint {...{ text: pointText }} />
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

            {["normal"].includes(quiz.quizType) && (
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

            {["quiz"].includes(quiz.quizType) && (
              <>
                <h2 className={styles.resultTitle}>
                  У вас {quiz.questions.length - wrongAnswersCount}{" "}
                  {getDeclension({
                    count: quiz.questions.length - wrongAnswersCount,
                    caseOneItem: "правильный ответ",
                    caseTwoThreeFourItems: "правильных ответа",
                    restCases: "правильных ответов",
                  })}
                </h2>
                <div className={styles.resultDescription}>
                  Это не проверочный тест и количество правильных ответов не
                  влияет на получение сертификата. Вы можете перепройти квиз в
                  любой момент, чтобы вспомнить материал.
                </div>
              </>
            )}

            {["checklist"].includes(quiz.quizType) && (
              <>
                <h2 className={styles.resultTitle}>
                  Сколько вы набрали баллов
                </h2>
                {(quizTypeRelatedSettings as Array<QuizTypeChecklistSettings>)
                  .sort(
                    // Descending sort
                    (
                      { points_needed: points_1 },
                      { points_needed: points_2 }
                    ) => {
                      return Number(points_2) - Number(points_1);
                    }
                  )
                  .map(
                    (
                      (isActiveDefined) =>
                      ({
                        interval_title: title,
                        points_needed: points,
                        description,
                      }) =>
                        (
                          <QuizCheckListResult
                            {...{
                              title,
                              description,
                              isActive:
                                Object.is(userPoints, null) ||
                                isActiveDefined === true
                                  ? false
                                  : userPoints >= Number(points)
                                  ? (isActiveDefined = true)
                                  : false,
                            }}
                          />
                        )
                    )(false)
                  )}
              </>
            )}
          </>
        )}

        {!actionStartLoading &&
          !!question &&
          !(isQuizCompleted || block.isCompleted) && (
            <div>
              {question.answerType === "multiple" && (
                <AnswerMultiple
                  {...{
                    style: ["checklist", "quiz"].includes(quiz.quizType)
                      ? "fullfilledBox"
                      : "borderedBox",
                  }}
                />
              )}
              {question.answerType === "matrix_sort_answer" && <AnswerMatrix />}
              {question.answerType === "single" && (
                <AnswerSingle
                  {...{
                    style: ["checklist", "quiz"].includes(quiz.quizType)
                      ? "fullfilledBox"
                      : "borderedBox",
                    onAfterChange: ["quiz"].includes(quiz.quizType)
                      ? ({ setErrorIndexes, selectedIndexes }) => {
                          if (typeof selectedIndexes[0] === "undefined") return;

                          const answer =
                            question.answerData[selectedIndexes[0]];

                          if (typeof answer === "undefined") return;

                          const { incorrectMsg, correctMsg } = question;
                          const { correct } = answer;

                          if (correct) {
                            setErrorIndexes([]);
                            setAnswerComment({
                              type: "success",
                              message: correctMsg,
                            });
                          } else {
                            setErrorIndexes([selectedIndexes[0]]);
                            setAnswerComment({
                              type: "error",
                              message: incorrectMsg,
                            });
                          }

                          setIsActionsDisabled(false);
                        }
                      : undefined,
                  }}
                />
              )}
              {question.answerType === "essay" &&
                _.get(question, "answerData.0.gradedType") === "text" && (
                  <AnswerEssayText />
                )}
              {question.answerType === "essay" &&
                _.get(question, "answerData.0.gradedType") === "upload" && (
                  <AnswerEssayUpload />
                )}

              {["quiz"].includes(quiz.quizType) && answerComment.message && (
                <div
                  className={convertObjectToClassName({
                    [styles.answerComment]: true,
                    [styles.answerCommentSuccess]:
                      answerComment.type === "success",
                    [styles.answerCommentHavingError]:
                      answerComment.type === "error",
                  })}
                >
                  {answerComment.message}
                </div>
              )}
            </div>
          )}
      </div>

      {!actionStartLoading &&
        (_.get(question, "answerType", "") !== "essay" || isQuizCompleted) && (
          <QuizActions
            completeBlockDoneCallback={completeBlockDoneCallback}
            setActionStartLoadingBlock={setActionStartLoadingBlock}
            isActionsDisabled={isActionsDisabled}
          />
        )}
    </>
  );
};

export default Quiz;
