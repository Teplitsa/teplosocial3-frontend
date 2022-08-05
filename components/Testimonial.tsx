import { ReactElement } from "react";
import useMediaLoaded from "../custom-hooks/use-media-loaded";
import SkeletonMedia from "./skeletons/partials/SkeletonMedia";
import styles from "./Testimonial.module.scss";

interface ITestimonial {
  media: string;
  text: string;
  name: string;
  position: string;
}

const HomeTestimonial: React.FunctionComponent<ITestimonial> = ({
  media,
  text,
  name,
  position,
}): ReactElement => {
  const isMediaLoaded = useMediaLoaded(media);

  return (
    <figure className={styles["testimonial"]}>
      <blockquote
        className={styles["testimonial__text"]}
        dangerouslySetInnerHTML={{ __html: text }}
      />
      <figcaption className={styles["testimonial__author"]}>
        {(isMediaLoaded && (
          <img
            className={styles["testimonial__photo"]}
            src={media}
            width={61}
            height={61}
            alt={name}
          />
        )) || <SkeletonMedia width="61px" height="61px" borderRadius="50%" />}
        <span className={styles["testimonial__author-title"]}>
          <span className={styles["testimonial__author-name"]}>{name}</span>
          {position && (
            <cite className={styles["testimonial__author-position"]}>
              {position}
            </cite>
          )}
        </span>
      </figcaption>
    </figure>
  );
};

export default HomeTestimonial;
