import { ReactElement } from "react";
import useMediaLoaded from "../../../custom-hooks/use-media-loaded";
import SkeletonMedia from "../../skeletons/partials/SkeletonMedia";
import styles from "./HomeAdvantages.module.scss";

interface IHomeAdvantagesItem {
  media: string;
  title: string;
  text: string;
}

const HomeAdvantagesItem: React.FunctionComponent<IHomeAdvantagesItem> = ({
  media,
  title,
  text,
}): ReactElement => {
  const isMediaLoaded = useMediaLoaded(media);

  return (
    <>
      {(isMediaLoaded && (
        <img
          className={styles["home-advantages__item-image"]}
          src={media}
          width={38}
          height={38}
          alt={`Иконка ${title}`}
        />
      )) || <SkeletonMedia width="38px" height="38px" borderRadius="50%" />}
      <h3 className={styles["home-advantages__item-title"]}>{title}</h3>
      <p
        className={styles["home-advantages__item-text"]}
        dangerouslySetInnerHTML={{ __html: text }}
      />
    </>
  );
};

export default HomeAdvantagesItem;
