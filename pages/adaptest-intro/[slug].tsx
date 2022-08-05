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
  const {error: courseError, data: course} = await courseModel.requestCourse(slug, {req, res});
  const {error: blockError, data: adaptest} = await quizModel.requestQuizBySlug(course.adaptestSlug, {req, res});

  // console.log("slug:", slug);
  // console.log("course slug:", block.courseSlug);
  // console.log("course:", course.slug);

  const model = {
    app: {},
    page: course,
    blockPage: {
      ...{
        block: {
          ...course,
          title: {
            rendered: "Введение",
          },
          content: {
            rendered: `${course.content.rendered}
              ${!_.isEmpty(_.trim(course.learningResult)) ? `
                <h4>Чему вы научитесь</h4>
                <p>${course.learningResult}</p>
              ` : ""}
            `,
          },
          duration: adaptest.duration,
          contentType: "adaptest-intro",
          isTaskUploaded: false,
          uploadedTask: null,
        },
        course,
      },
    }
  };

  return {
    props: {...model},
  };
};

export default CoursePage;
