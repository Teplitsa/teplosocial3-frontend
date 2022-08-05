import { ReactElement, useEffect } from "react";
import { GetServerSideProps } from "next";
import * as _ from "lodash";

import {
  IModuleState,
} from "../../model/model.typing";

import DocumentHead from "../../components/DocumentHead";
import Main from "../../components/layout/Main";
import Course from "../../components/page/Course";
import * as courseModel from "../../model/learn/course-model";
import * as moduleModel from "../../model/learn/module-model";

const ModulePage: React.FunctionComponent = (): ReactElement => {

  return (
    <>
      <DocumentHead />
      <Main>
        <main role="main">
          <Course />
        </main>
      </Main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res, params: { slug } }) => {
  const {error: moduleError, data: module} = await moduleModel.requestModule(slug, {req, res});
  // console.log("moduleList data:", moduleList);

  const {error: courseError, data: course} = await courseModel.requestCourse((module as IModuleState).courseSlug);
  // console.log("course data:", course);

  if(_.isEmpty(course) || _.isEmpty(module)) {
    return {
      notFound: true,
    }
  }

  const model = {
    app: {},
    page: course,
    coursePage: {
      course,
      moduleList: [module],
    }
  };

  return {
    props: {...model},
  };
};

export default ModulePage;
