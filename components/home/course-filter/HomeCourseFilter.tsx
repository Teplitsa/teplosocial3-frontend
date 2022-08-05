import { ReactElement } from "react";
import Link from "next/link";
import { useStoreState } from "../../../model/helpers/hooks";
import styles from "./HomeCourseFilter.module.scss";

const HomeCourseFilter: React.FunctionComponent = (): ReactElement => {
  const tags = useStoreState(
    (state) => state.components.homePage.courseFilter.tags
  );

  return (
    <section className={styles["home-course-filter"]}>
      <h2 className={styles["home-course-filter__title"]}>
        Чем вы интересуетесь?
      </h2>
      <p className={styles["home-course-filter__lead"]}>
        Вы можете выбрать интересную вам тему и мы отберём курсы по ней.
      </p>
      <ul className={styles["home-course-filter__list"]}>
        {tags.map(({ _id, externalId, name }) => (
          <li
            key={`HomeCourseFilterItem-${_id}`}
            className={styles["home-course-filter__item"]}
          >
            <Link href={`/catalog?filter[tag_id]=${externalId}`}>
              <a className={styles["home-course-filter__btn"]} target="_blank">
                {name}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default HomeCourseFilter;
