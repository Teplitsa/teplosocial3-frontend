import { ReactElement } from "react";
import { useRouter } from "next/router";
import { useStoreState } from "../../../model/helpers/hooks";
import InclusiveComponents from "../../../inclusive-components/inclusive-components";
import { convertObjectToClassName } from "../../../utilities/utilities";
import styles from "./DashboardUserInfo.module.scss";

const { Button } = InclusiveComponents;

const DashboardUserInfo: React.FunctionComponent = (): ReactElement => {
  const router = useRouter();
  const user = useStoreState((state) => state.session.user);

  function handleProfileLinkClick(): void {
    router.push(`/members/${user.slug}`);
  }

  return (
    <section className={styles["dashboard-userinfo"]}>
      <h2 className={styles["dashboard-userinfo__title"]}>
        Информация о пользователе
      </h2>
      <div className={styles["dashboard-userinfo__group"]}>
        <figure className={styles["dashboard-userinfo__avatar-container"]}>
          {user.avatar && (
            <img
              className={styles["dashboard-userinfo__avatar"]}
              src={user.avatar}
              width={70}
              height={70}
              alt={`Фотография пользователя ${user.firstName} ${user.lastName}`}
            />
          )}
        </figure>
        <h3
          className={styles["dashboard-userinfo__fullname"]}
          dangerouslySetInnerHTML={{ __html: user.fullName }}
        />
        {user.city && (
          <p className={styles["dashboard-userinfo__location"]}>
            <span className={styles["dashboard-userinfo__location-label"]}>
              Местонахождение:
            </span>{" "}
            {user.city}
          </p>
        )}
      </div>
      <div className={styles["dashboard-userinfo__action"]}>
        <Button
          className={convertObjectToClassName({
            btn_primary: true,
            [styles["dashboard-userinfo__profile-link"]]: true,
          })}
          role="link"
          onClick={handleProfileLinkClick}
        >
          Перейти в профиль
        </Button>
      </div>
    </section>
  );
};

export default DashboardUserInfo;
