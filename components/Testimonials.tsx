import { ReactElement } from "react";
import useMediaLoaded from "../custom-hooks/use-media-loaded";
import SkeletonMedia from "./skeletons/partials/SkeletonMedia";
import styles from "./Testimonials.module.scss";

interface IHomeAdvantagesItem {
  media: string;
  text: string;
  name: string;
  position: string;
}

export const TestimonialsItem: React.FunctionComponent<IHomeAdvantagesItem> = ({
  media,
  text,
  name,
  position,
}): ReactElement => {
  const isMediaLoaded = useMediaLoaded(media);

  return (
    <figure className={styles["testimonial"]}>
      {(isMediaLoaded && (
        <img
          className={styles["testimonial__photo"]}
          src={media}
          width={136}
          height={136}
          alt={name}
        />
      )) || <SkeletonMedia width="136px" height="136px" borderRadius="50%" />}
      <blockquote
        className={styles["testimonial__text"]}
        dangerouslySetInnerHTML={{ __html: text }}
      />
      <figcaption className={styles["testimonial__author"]}>
        <span className={styles["testimonial__author-name"]}>{name}</span>
        {position && (
          <cite className={styles["testimonial__author-position"]}>
            {position}
          </cite>
        )}
      </figcaption>
    </figure>
  );
};
