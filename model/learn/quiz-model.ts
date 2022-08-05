import { action, computed, thunk } from "easy-peasy";
import * as _ from "lodash";
import {
  IQuizModel,
  IQuizState,
  IQuizActions,
  IQuizThunks,
  IQuizCheckedAnswer,
  IPageState,
  IStoreModel,
} from "../model.typing";
import { learnPostInitialState } from "../base/learn-post-model";
import * as utils from "../../utilities/utilities";

const passingState = {
  activeQuestionIndex: 0,
  userAnswers: {},
  answeredQuestions: [],
  checkedAnswers: null,
  startTimestamp: 0,
  endTimestamp: 0,
  userAnswersResult: {},
  isPassed: false,
};

export const quizState: IQuizState = {
  ..._.cloneDeep(learnPostInitialState),
  nonce: "",
  quizProId: 0,
  questions: [],
  isAdaptest: false,
  isAdaptestPassedRepeatedly: false,
  courseSlug: "",
  duration: 0,
  ...passingState,
};

export const quizActions: IQuizActions = {
  initializeState: action((prevState) => {
    // console.log("quizActions.initializeState...");
    if (!_.isEmpty(prevState)) {
      Object.assign(prevState, quizState);
    }
    Object.assign(prevState, passingState);
  }),
  initPassingState: action((prevState) => {
    Object.assign(prevState, {
      ...passingState,
      startTimestamp: Date.now(),
    });
  }),
  setState: action((prevState, newState) => {
    // console.log("setState: ", newState);
    Object.assign(prevState, newState);
  }),
  activeQuestion: computed((state: any) => {
    return state.questions[state.activeQuestionIndex ?? 0] ?? null;
  }),
  addUserAnswer: action((state, { questionId, answerValue }) => {
    if (
      _.isEmpty(state.userAnswers) ||
      _.isEmpty(state.userAnswers[questionId])
    ) {
      state.userAnswers[questionId] = [];
    }

    state.userAnswers[questionId].push(answerValue);
  }),
  setUserAnswer: action((state, { questionId, answerValue }) => {
    if (_.isEmpty(state.userAnswers[questionId])) {
      state.userAnswers[questionId] = [];
    }

    state.userAnswers[questionId] = [answerValue];
  }),
  setUserAnswerMatrix: action((state, { questionId, answerValue }) => {
    if (_.isEmpty(state.userAnswers)) {
      state.userAnswers = {};
    }
    state.userAnswers[questionId] = answerValue;
  }),
  deleteUserAnswer: action((state, { questionId, answerValue }) => {
    if (
      _.isEmpty(state.userAnswers) ||
      _.isEmpty(state.userAnswers[questionId])
    ) {
      state.userAnswers[questionId] = [];
    }

    state.userAnswers[questionId] = state.userAnswers[questionId].filter(
      (v) => v !== answerValue
    );
  }),
  setActiveQuestionIndex: action((state, payload) => {
    state.activeQuestionIndex = payload;
  }),
  addAnsweredQuestion: action((state, payload) => {
    const foundAnswerIndex = state.answeredQuestions.findIndex(
      (aqId) => aqId === payload
    );
    if (foundAnswerIndex >= 0) {
      state.answeredQuestions.splice(foundAnswerIndex);
    }
    state.answeredQuestions.push(payload);
  }),
  setCheckedAnswers: action((state, payload) => {
    state.checkedAnswers = payload;
  }),
  setUserAnswersResult: action((state, payload) => {
    state.userAnswersResult = payload;
    state.endTimestamp = Date.now();
  }),
  isCompleted: computed((state: any) => {
    return state.endTimestamp > 0;
  }),
  wrongAnswersCount: computed((state: any) => {
    return state.questions.reduce((counter, q) => {
      const checkedAnswer: IQuizCheckedAnswer = _.get(
        state.checkedAnswers,
        q.id,
        null
      ) as IQuizCheckedAnswer;
      if (checkedAnswer && isAnswerWrong(checkedAnswer)) {
        counter += 1;
      }
      return counter;
    }, 0);
  }),
  answersToBeGradedCount: computed((state: any) => {
    return state.questions.reduce((counter, q) => {
      const checkedAnswer: IQuizCheckedAnswer = _.get(
        state.checkedAnswers,
        q.id,
        null
      ) as IQuizCheckedAnswer;
      if (checkedAnswer && isAnswerNeedToBeGraded(checkedAnswer)) {
        counter += 1;
      }
      return counter;
    }, 0);
  }),
  isPassed: computed((state: any) => {
    const correctAnswersCount = state.questions.reduce((counter, q) => {
      const checkedAnswer: IQuizCheckedAnswer = _.get(
        state.checkedAnswers,
        q.id,
        null
      ) as IQuizCheckedAnswer;
      if (checkedAnswer && isAnswerCorrect(checkedAnswer)) {
        counter += 1;
      }
      return counter;
    }, 0);

    const resultPercent = state.questions.length
      ? Math.round((100 * correctAnswersCount) / state.questions.length)
      : 0;
    const isQuizPassed = resultPercent >= state.passingpercentage;

    return isQuizPassed;
  }),
};

export const quizThunks: IQuizThunks = {
  startQuizByUser: thunk(
    async (actions, { quiz, module, user, doneCallback }) => {
      let error = "";
      let data = {};

      try {
        let url = utils.getAjaxUrl("wp_pro_quiz_load_quiz_data");
        const formData = utils.JSONToFormData({
          quizId: quiz.quizProId,
          quiz_nonce: quiz.nonce,
          quiz: quiz.id,
          course_id: module.id,
        });

        const response = await utils.tokenFetch(url, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          ({ message: error } = await response.json());
        } else {
          data = await response.json();
          doneCallback(data);
          return;
        }
      } catch (error) {
        console.error(error);
        error = "Ошибка!";
      }

      doneCallback({ error });
    }
  ),
  checkQuizUserAnswers: thunk(
    async (actions, { quiz, module, user, doneCallback }) => {
      let error = "";
      let data = {};

      try {
        const answers2Check = getQuizUserAnswersToCheck(quiz);
        // console.log("answers2Check:", answers2Check);

        let url = utils.getAjaxUrl("ld_adv_quiz_pro_ajax");
        const formData = utils.JSONToFormData({
          func: "checkAnswers",
          "data[quizId]": quiz.quizProId,
          "data[quiz]": quiz.id,
          "data[course_id]": module.id,
          "data[quiz_nonce]": quiz.nonce,
          "data[responses]": answers2Check,
          quiz: quiz.id,
          course_id: module.id,
          quiz_nonce: quiz.nonce,
        });

        const response = await utils.tokenFetch(url, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          ({ message: error } = await response.json());
        } else {
          data = await response.json();

          actions.setCheckedAnswers(data);

          const answersResult = ldCheckedAnswersToAnswersResult(data);
          // console.log("answersResult:", answersResult);
          actions.setUserAnswersResult(answersResult);

          doneCallback(data);

          return;
        }
      } catch (error) {
        console.error(error);
        error = "Ошибка!";
      }

      doneCallback({ error });
    }
  ),
  completeQuizByUser: thunk(
    async (actions, { quiz, block, module, user, doneCallback }) => {
      let error = "";
      let data = {};

      try {
        const resultsToCompleteQuiz = getQuizUserResults(quiz);
        // console.log("completeQuizByUser results:", resultsToCompleteQuiz)

        let url = utils.getAjaxUrl("wp_pro_quiz_completed_quiz");
        const formData = utils.JSONToFormData({
          course_id: module.id,
          lesson_id: block.id,
          topic_id: 0,
          quiz: quiz.id,
          quizId: quiz.quizProId,
          results: resultsToCompleteQuiz,
          timespent: quiz.endTimestamp - quiz.startTimestamp,
          quiz_nonce: quiz.nonce,
        });

        const response = await utils.tokenFetch(url, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          ({ message: error } = await response.json());
        } else {
          data = await response.json();
          doneCallback({ ...data });
          return;
        }
      } catch (error) {
        console.error(error);
        error = "Ошибка!";
      }

      doneCallback({ error });
    }
  ),
  requestBySlug: thunk(async (actions, { slug }) => {
    const { error, data } = await requestQuizBySlug(slug);
    // console.log("data: ", data);

    if (!error) {
      actions.setState(data as IQuizState);
    } else {
      console.error(error);
    }
  }),
};

export async function requestQuizForBlock(blockSlug, options = {}) {
  let error = "";
  let data = {};

  try {
    let url = new URL(
      utils.getRestApiUrl(`/tps/v1/quiz/get-by-block/${blockSlug}`)
    );

    const response = await utils.tokenFetch(url, options);

    if (!response.ok) {
      ({ message: error } = await response.json());
    } else {
      const responseData = await response.json();
      data = _.get(responseData, "0", {});
    }
  } catch (error) {
    console.error(error);
    error = "Ошибка!";
  }

  // console.log("data:", data);
  return { error, data: data as IQuizState };
}

export async function requestQuizBySlug(slug, options = {}) {
  let error = "";
  let data = {};

  try {
    let url = new URL(utils.getRestApiUrl(`/ldlms/v1/sfwd-quiz`));
    url.search = new URLSearchParams({ slug }).toString();
    // console.log("requestQuizBySlug url:", url);

    const response = await utils.tokenFetch(url, options);

    if (!response.ok) {
      ({ message: error } = await response.json());
    } else {
      const responseData = await response.json();
      data = _.get(responseData, "0", {});
    }
  } catch (error) {
    console.error(error);
    error = "Ошибка!";
  }

  // console.log("data:", data);
  return { error, data: data as IQuizState };
}

function getQuizUserAnswersToCheck(quiz: IQuizState) {
  const answersToCheck = quiz.questions.reduce((answersToCheck, q) => {
    const questionId = q.id;

    // console.log("questionId:", questionId);
    // console.log("is matrix:", q.answerType === "matrix_sort_answer");
    // console.log("quiz.userAnswers:", _.get(quiz.userAnswers, `${questionId}`, null));

    let response: any = "";
    if (q.answerType === "essay") {
      response = _.get(quiz.userAnswers, `${questionId}.0`, "");
    } else {
      response = q.answerData.reduce((questionAnswers, answer, answerIndex) => {
        if (q.answerType === "matrix_sort_answer") {
          questionAnswers[answerIndex] = _.get(
            quiz.userAnswers,
            `${questionId}.${answerIndex}`,
            ""
          );
        } else {
          questionAnswers[answerIndex] =
            !_.isEmpty(quiz.userAnswers[questionId]) &&
            quiz.userAnswers[questionId].findIndex(
              (a) => answer.answer === a
            ) >= 0;
        }

        return questionAnswers;
      }, {});
    }

    answersToCheck[questionId] = {
      response,
      question_pro_id: questionId,
      question_post_id: 0,
    };

    return answersToCheck;
  }, {});

  // console.log("answersToCheck:", answersToCheck);
  return answersToCheck;
}

function getQuizUserResults(quiz: IQuizState) {
  var pointsTotal = 0;
  var correctQuestionsCount = 0;

  const results = quiz.questions.reduce((results, q) => {
    const questionId = q.id;
    const checkedAnswer: IQuizCheckedAnswer = _.get(
      quiz.checkedAnswers,
      questionId,
      null
    ) as IQuizCheckedAnswer;

    const userAnswers = checkedAnswer.e.c.reduce(
      (userAnswers, flagState, answerIndex) => {
        userAnswers[String(answerIndex)] = flagState ? 1 : 0;
        return userAnswers;
      },
      {}
    );

    results[questionId] = {
      time: 0,
      points: checkedAnswer.p,
      p_nonce: checkedAnswer.p_nonce,
      correct: checkedAnswer.c ? 1 : 0,
      data: userAnswers,
      a_nonce: checkedAnswer.a_nonce,
      possiblePoints: checkedAnswer.e.possiblePoints,
    };

    pointsTotal += checkedAnswer.p;
    correctQuestionsCount += checkedAnswer.c ? 1 : 0;

    return results;
  }, {});

  const resultPercent = quiz.questions.length
    ? Math.round((100 * correctQuestionsCount) / quiz.questions.length)
    : 0;

  results["comp"] = {
    points: pointsTotal,
    correctQuestions: correctQuestionsCount,
    quizTime: quiz.endTimestamp - quiz.startTimestamp,
    quizEndTimestamp: quiz.endTimestamp,
    quizStartTimestamp: quiz.startTimestamp,
    result: resultPercent,
    cats: {
      "0": resultPercent,
    },
  };

  return results;
}

function ldCheckedAnswersToAnswersResult(checkedAnswers) {
  let answersResult = {};
  for (let answerId in checkedAnswers) {
    const checkedAnswer = checkedAnswers[answerId] as IQuizCheckedAnswer;
    answersResult[answerId] = !isAnswerWrong(checkedAnswer);
  }
  return answersResult;
}

function isAnswerNeedToBeGraded(checkedAnswer) {
  return (
    _.get(checkedAnswer, "e.type") === "essay" &&
    _.get(checkedAnswer, "e.graded_status") === "not_graded"
  );
}

function isAnswerWrong(checkedAnswer) {
  return !checkedAnswer.c && !isAnswerNeedToBeGraded(checkedAnswer);
}

function isAnswerCorrect(checkedAnswer) {
  return !!checkedAnswer.c;
}

const quizModel: IQuizModel = { ...quizState, ...quizActions, ...quizThunks };

export default quizModel;
