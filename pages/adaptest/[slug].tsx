import { ReactElement, useEffect } from "react";
import { GetServerSideProps } from "next";

import { IBlockState } from "../../model/model.typing";
import DocumentHead from "../../components/DocumentHead";
import Main from "../../components/layout/Main";
import Block from "../../components/page/Block";
import * as blockModel from "../../model/learn/block-model";
import * as moduleModel from "../../model/learn/module-model";
import * as courseModel from "../../model/learn/course-model";
import * as quizModel from "../../model/learn/quiz-model";

const AdaptestPage: React.FunctionComponent = (): ReactElement => {
  return (
    <>
      <DocumentHead />
      <Main>
        <main role="main">
          <Block />
        </main>
      </Main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params: { slug },
  query,
}) => {
  const isAdaptestPassedRepeatedly =
    Number.isNaN(Number(query.repeatedly)) ||
    ![0, 1].includes(Number(query.repeatedly))
      ? null
      : Number(query.repeatedly);

  const { error: blockError, data: quiz } = await quizModel.requestQuizBySlug(
    slug,
    { req, res }
  );
  const { error: courseError, data: course } = await courseModel.requestCourse(
    quiz.courseSlug,
    { req, res }
  );

  const model = {
    app: {},
    page: quiz,
    blockPage: {
      ...{
        block: {
          ...quiz,
          contentType: "test",
          isTaskUploaded: false,
          uploadedTask: null,
          quiz,
        },
        course,
      },
      ...(() => {
        const quizData = { quiz };

        if (quizData.quiz.questions.length > 0) {
          if (!Object.is(isAdaptestPassedRepeatedly, null)) {
            quizData.quiz.isAdaptestPassedRepeatedly = Boolean(
              isAdaptestPassedRepeatedly
            );
          }

          return quizData;
        }

        return {};
      })(),
    },
  };

  return {
    props: { ...model },
  };
};

export default AdaptestPage;
