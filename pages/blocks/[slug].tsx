import { ReactElement, useEffect } from "react";
import { GetServerSideProps } from "next";
import * as _ from "lodash";

import {
  IBlockState,
} from "../../model/model.typing";
import DocumentHead from "../../components/DocumentHead";
import Main from "../../components/layout/Main";
import Block from "../../components/page/Block";
import * as blockModel from "../../model/learn/block-model";
import * as moduleModel from "../../model/learn/module-model";
import * as courseModel from "../../model/learn/course-model";
import * as quizModel from "../../model/learn/quiz-model";

const CoursePage: React.FunctionComponent = (): ReactElement => {

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

export const getServerSideProps: GetServerSideProps = async ({ req, res, params: { slug } }) => {
  const {error: blockError, data: block} = await blockModel.requestBlock(slug, {req, res});
  const {error: moduleError, data: module} = await moduleModel.requestModule(block.moduleSlug, {req, res});
  const {error: courseError, data: course} = await courseModel.requestCourse(block.courseSlug, {req, res});
  const {error: quizError, data: quiz} = block.contentType === "test"
    ? await quizModel.requestQuizForBlock(block.slug, {req, res})
    : {error: null, data: null};

  // console.log("quiz:", quiz);
  // console.log("slug:", slug);
  // console.log("block:", block.slug);
  // console.log("module slug:", block.moduleSlug);
  // console.log("course slug:", block.courseSlug);
  // console.log("course:", course.slug);

  const model = {
    app: {},
    page: block,
    blockPage: {
      ...{
        block,
        module,
        course,
      },
      ...!_.isEmpty(quiz) ? {quiz} : {},
    }
  };

  return {
    props: {...model},
  };
};

export default CoursePage;
