import { ReactElement } from "react";
import { useStoreState } from "../../../model/helpers/hooks";
import HomeTestimonial from "../../Testimonial";
import InclusiveComponents from "../../../inclusive-components/inclusive-components";
import styles from "./HomeTestimonials.module.scss";

const { Carousel } = InclusiveComponents;

const HomeTestimonialsTitle: React.FunctionComponent = (): ReactElement => (
  <h2 className={styles["home-testimonials__title"]}>Отзывы о платформе</h2>
);

const HomeTestimonials: React.FunctionComponent = (): ReactElement => {
  const testimonials = useStoreState(
    (state) => state.components.homePage.testimonials
  );

  return (
    <section className={styles["home-testimonials"]}>
      <Carousel
        topContent={HomeTestimonialsTitle}
        itemWidth={1140}
        classNameObject={{
          viewport: {
            [styles["home-testimonials__viewport"]]: true,
          },
          controls: {
            [styles["home-testimonials__controls"]]: true,
          },
          nav: {
            [styles["home-testimonials__nav"]]: true,
          },
        }}
      >
        <ul className={styles["home-testimonials__list"]}>
          {testimonials.map(
            ({
              _id,
              title: name,
              excerpt: position,
              content: text,
              thumbnail: media,
            }) => (
              <li
                key={`HomeTestimonialsItem-${_id}`}
                className={styles["home-testimonials__item"]}
              >
                <HomeTestimonial {...{ name, position, text, media }} />
              </li>
            )
          )}
        </ul>
      </Carousel>
    </section>
  );
};

export default HomeTestimonials;
