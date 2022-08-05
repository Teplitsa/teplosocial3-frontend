import { ReactElement } from "react";
import Link from "next/link";
import { useStoreState } from "../../model/helpers/hooks";
import CatalogCourseFilter from "../catalog/course-filter/CatalogCourseFilter";
import CatalogCourses from "../catalog/courses/CatalogCourses";
import CatalogTracks from "../catalog/tracks/CatalogTracks";

import styles from "./Catalog.module.scss";

const Catalog: React.FunctionComponent = (): ReactElement => {
  const courseTotal = useStoreState(
    (state) => state.components.catalogPage.courseTotal
  );
  const trackTotal = useStoreState(
    (state) => state.components.catalogPage.trackTotal
  );

  return (
    <main className={styles["catalog"]}>
      <h1 className={styles["catalog__title"]}>Каталог курсов</h1>
      <CatalogCourseFilter />
      {(!courseTotal && !trackTotal && (
        <>
          <h2 className={styles["catalog__subtitle"]}>Мы ничего не нашли :(</h2>
          <div className={styles["catalog__empty-message"]}>
            Попробуйте переформулировать запрос, поискать по тегам или{" "}
            <Link href="/catalog">
              <a>полистать полный каталог</a>
            </Link>{" "}
            &mdash; у нас много интересного!
          </div>
        </>
      )) || (
        <>
          <CatalogCourses />
          <CatalogTracks />
        </>
      )}
    </main>
  );
};

export default Catalog;
