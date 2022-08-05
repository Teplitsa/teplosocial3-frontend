import { ReactElement } from "react";
import { GetServerSideProps } from "next";

import DocumentHead from "../../components/DocumentHead";
import Main from "../../components/layout/Main";
import Course from "../../components/page/Course";
import * as courseModel from "../../model/learn/course-model";
import * as moduleModel from "../../model/learn/module-model";

const CoursePage: React.FunctionComponent = (): ReactElement => {
  return (
    <>
      <DocumentHead />
      <Main>
        <main role="main" className="courseContent">
          <Course />
        </main>
      </Main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params: { slug },
}) => {
  const { error: courseError, data: course } = await courseModel.requestCourse(
    slug,
    { req, res }
  );

  const { error: moduleListError, data: moduleList } =
    await moduleModel.requestModuleListByCourse(slug, { req, res });

  const model = {
    app: {},
    page: course,
    coursePage: {
      course,
      moduleList,
    },
  };

  return {
    props: { ...model },
  };
};

export default CoursePage;
