import { ReactElement, useState } from "react";
import { useRouter } from "next/router";
import { useStoreState } from "../../model/helpers/hooks";

import CourseHeader from "../learn/course/CourseHeader";
import CourseContent from "../learn/course/CourseContent";
import CourseDescription from "../learn/course/CourseDescription";
import ProcessExplanation from "../learn/course/ProcessExplanation";
import CourseTeacherList from "../learn/course/CourseTeacherList";
import CourseTestimonials from "../learn/course/CourseTestimonials";

const Course: React.FunctionComponent = (): ReactElement => {
  const course = useStoreState((state) => state.components.coursePage.course);
  const router = useRouter();
  const [courseStartLoading, setCourseStartLoading] = useState(false);

  return (
    <>
      <CourseHeader
        {...{
          course,
          courseStartLoading,
          setCourseStartLoading,
          courseStartedCallback,
          alternativeCourseStartingCallback:
            !!course.adaptestSlug &&
            !course.isAdaptestCompleted &&
            !course.isStarted
              ? alternativeCourseStartingCallback
              : null,
        }}
      />
      <CourseDescription
        {...{
          course,
        }}
      />
      <CourseContent
        {...{
          course,
          courseStartLoading,
          setCourseStartLoading,
          courseStartedCallback,
        }}
      />
      <CourseTeacherList />
      <ProcessExplanation />
      <CourseTestimonials />
    </>
  );

  function alternativeCourseStartingCallback() {
    router.push(`/adaptest-intro/${course.slug}`);
  }

  function courseStartedCallback(params: { startBlockSlug: string }): void {
    if (params) {
      if (params.startBlockSlug) {
        router.push("/blocks/" + params.startBlockSlug);
      } else {
        router.push("/courses/" + course.slug);
      }
    } else {
      setCourseStartLoading(false);
    }
  }
};

export default Course;
