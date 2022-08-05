import { ReactElement } from "react";
import Link from "next/link";
import { useStoreState } from "../../../model/helpers/hooks";
import styles from "./AboutTracks.module.scss";

const AboutTracks: React.FunctionComponent = (): ReactElement => {
  const tracks = useStoreState((state) => state.components.aboutPage.tracks);

  return (
    <section className={styles["about-tracks"]}>
      <h2 className={styles["about-tracks__title"]}>Что такое треки?</h2>
      <p className={styles["about-tracks__lead"]}>
        Треки — это подборки курсов, которые помогут изучить тему системно:
      </p>
      <ul className={styles["about-tracks__list"]}>
        {tracks.map(({ _id, slug, title }) => (
          <li
            key={`AboutTracksListItem-${_id}`}
            className={styles["about-tracks__item"]}
          >
            <Link href={`/tracks/${slug}`}>
              <a className={styles["about-tracks__btn"]}>
                {title}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default AboutTracks;
