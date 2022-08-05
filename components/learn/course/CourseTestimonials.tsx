import { ReactElement } from "react";
import { useStoreState } from "../../../model/helpers/hooks";
import CourseTestimonial from "../../Testimonial";
import InclusiveComponents from "../../../inclusive-components/inclusive-components";
import styles from "./CourseTestimonials.module.scss";

const { Carousel } = InclusiveComponents;

const CourseTestimonials: React.FunctionComponent = (): ReactElement => {
  const testimonials = useStoreState(
    (state) => state.components.coursePage.course.testimonialList
  );

  if (!testimonials?.length) {
    return null;
  }

  return (
    <section className={styles["course-testimonials"]}>
      <h2 className={styles["course-testimonials__title"]}>Отзывы о курсе</h2>
      <Carousel
        itemWidth={840}
        classNameObject={{
          viewport: {
            [styles["course-testimonials__viewport"]]: true,
          },
          nav: {
            [styles["course-testimonials__nav"]]: true,
          },
        }}
        controls={false}
      >
        <ul className={styles["course-testimonials__list"]}>
          {testimonials.map(({ id, name, position, text, avatar: media }) => (
            <li
              key={`TestimonialsItem-${id}`}
              className={styles["course-testimonials__item"]}
            >
              <CourseTestimonial {...{ name, position, text, media }} />
            </li>
          ))}
        </ul>
      </Carousel>
    </section>
  );
};

export default CourseTestimonials;
