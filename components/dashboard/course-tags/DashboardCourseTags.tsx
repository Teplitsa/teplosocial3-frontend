import { ReactElement } from "react";
import Link from "next/link";
import { useStoreState } from "../../../model/helpers/hooks";
import styles from "./DashboardCourseTags.module.scss";
import { convertObjectToClassName } from "../../../utilities/utilities";

const DashboardCourseTags: React.FunctionComponent = (): ReactElement => {
  const tags = useStoreState(
    (state) => state.components.dashboardPage.courseTags
  );

  return (
    <div className={styles["dashboard-course-tags"]}>
      <ul className={styles["dashboard-course-tags__list"]}>
        {tags.map(({ _id, externalId, name }) => (
          <li
            key={`DashboardCourseTag-${_id}`}
            className={styles["dashboard-course-tags__item"]}
          >
            <Link href={`/catalog?filter[tag_id]=${externalId}`}>
              <a
                className={convertObjectToClassName({
                  [styles["dashboard-course-tags__btn"]]: true,
                  [styles["dashboard-course-tags__btn_tag"]]: true,
                })}
                target="_blank"
              >
                {name}
              </a>
            </Link>
          </li>
        ))}
        <li
          key={`CatalogLink`}
          className={styles["dashboard-course-tags__item"]}
        >
          <Link href="/catalog">
            <a
              className={convertObjectToClassName({
                [styles["dashboard-course-tags__btn"]]: true,
                [styles["dashboard-course-tags__btn_catalog"]]: true,
              })}
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

export default DashboardCourseTags;
