import { ReactElement, useRef } from "react";
import Link from "next/link";
import { useStoreState } from "../../../model/helpers/hooks";

import useIsomorphicLayoutEffect from "../../../custom-hooks/use-isomorphic-layout-effect";

import styles from "./FooterTags.module.scss";

const FooterNav: React.FunctionComponent = (): ReactElement => {
  const tagsListRef = useRef<HTMLUListElement>(null);
  const tags = useStoreState((state) => state.page.courseTags);

  useIsomorphicLayoutEffect(() => {
    const { innerWidth: viewportWidth } = window;

    if (!tagsListRef?.current || viewportWidth <= 991 || tags.length === 0)
      return;

    const limit = { x: tagsListRef.current.offsetWidth, y: 39 * 3 + 12 * 2 };

    const tagElements = Array.from(tagsListRef.current.children);

    let currentRow = 1;
    let currentWidth = 0;

    for (let i in tagElements) {
      // depends on gap: (12 * 2) / 3 = 8
      const tagWidth = (tagElements[i] as HTMLElement).offsetWidth + 8;

      currentWidth += tagWidth;

      if (currentWidth > limit.x) {
        currentRow += 1;

        currentWidth =
          currentRow === 3
            ? (tagsListRef.current.lastChild as HTMLElement).offsetWidth +
              8 +
              tagWidth
            : tagWidth;
      }

      if (currentRow > 3) {
        if (Number(i) !== tags.length) {
          tagElements[i as unknown as number].remove();
        }
      }
    }
  }, [tagsListRef, tags]);

  return (
    <div className={styles.container}>
      <ul className={styles["home-course-filter__list"]} ref={tagsListRef}>
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
        <li
          key={`HomeCourseFilterItem-all-courses`}
          className={styles["home-course-filter__item"]}
        >
          <Link href="/catalog">
            <a
              className={styles["home-course-filter__btn-all-courses"]}
              target="_blank"
            >
              Все курсы
            </a>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default FooterNav;
