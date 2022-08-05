import { ReactElement, Dispatch, useEffect, SetStateAction, useContext } from "react";
import { useRouter } from "next/router";
import { useStoreState, useStoreActions } from "../../../model/helpers/hooks";

import { IBlockState, ICourseState } from "../../../model/model.typing";
import ModuleListItem from "../module/ModuleListItem";
import AdaptestBanner from "./AdaptestBanner";

import stylesCourse from "./CourseContent.module.scss";

const CourseContent: React.FunctionComponent<{
  course: ICourseState;
}> = ({
  course,
}): ReactElement => {
  const moduleList = useStoreState(
    (state) => state.components.coursePage.moduleList
  );
  const adaptest = useStoreState((state) => state.components.blockPage.quiz);
  const requestAdaptest = useStoreActions(
    (actions) => actions.components.blockPage.quiz.requestBySlug
  );

  useEffect(() => {
    if (!course || !course.slug) {
      return;
    }

    if (!course.adaptestSlug) {
      return;
    }

    console.log("requestAdaptest...");
    requestAdaptest({ slug: course.adaptestSlug });
  }, [course]);

  // console.log("course.adaptestSlug:", course.adaptestSlug);
  // console.log("course.isAdaptestCompleted:", course.isAdaptestCompleted);

  return (
    <section className={stylesCourse.content}>
      <div className={stylesCourse.contentInner}>
        <h2 className={stylesCourse.listTitle}>Программа курса</h2>

        {moduleList && moduleList.length > 0 && (
          <div className={stylesCourse.list}>
            {moduleList.map((module) => {
              return (
                <ModuleListItem
                  key={`CourseModule${module.slug}`}
                  module={module}
                  isOpen={moduleList.length === 1}
                />
              );
            })}
          </div>
        )}

        {!!course.adaptestSlug && !course.isAdaptestCompleted && (
          <div className={stylesCourse.adaptestBanner}>
            <AdaptestBanner
              block={
                {
                  courseSlug: course.slug,
                  slug: adaptest.slug,
                  title: {
                    rendered: "Сэкономьте время и найдите пробелы в знаниях",
                  },
                  excerpt: {
                    rendered:
                      "Мы зачтём модули, которые вы уже знаете.\nА то, что вам не известно, узнаете из курса.",
                  },
                  duration: adaptest.duration,
                } as IBlockState
              }
              mustDisplayAdaptestLink={true}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default CourseContent;
