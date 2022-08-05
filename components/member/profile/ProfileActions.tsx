import { ReactElement } from "react";
import { useRouter } from "next/router";
import * as _ from "lodash";

import { IProfileState } from "../../../model/model.typing";
import { useStoreActions } from "../../../model/helpers/hooks";
import InclusiveComponents from "../../../inclusive-components/inclusive-components";

import styles from "./ProfileActions.module.scss";

import imagePencilAlt from "../../../assets/img/pencil-alt.svg";
import imageLogout from "../../../assets/img/logout.svg";
import imageArrowRight from "../../../assets/img/arrow-right-gray.svg";

const { Button } = InclusiveComponents;

const ProfileActions: React.FunctionComponent<{
  profile: IProfileState;
}> = ({ profile }): ReactElement => {
  const router = useRouter();
  const logout = useStoreActions((state) => state.session.logout);

  return (
    <div className={styles.content}>
      <div className={styles.editProfileButton}>
        <Button
          className="btn_primary"
          aria-label={`Редактировать профиль`}
          onClick={() => {
            router.push(`/members/${profile.slug}/profile-edit`);
          }}
        >
          Редактировать профиль
        </Button>
      </div>

      <div className={styles.links}>
        <div className={styles.link}>
          <Button
            className="btn_reset"
            aria-label={`Сменить пароль`}
            onClick={() => {
              router.push("/auth/change-password");
            }}
          >
            <img src={imagePencilAlt} />
            <span>Сменить пароль</span>
            <img src={imageArrowRight} />
          </Button>
        </div>
        <div className={styles.link}>
          <Button
            className="btn_reset"
            aria-label={`Выйти`}
            onClick={() => {
              logout();
              router.push("/auth/login");
            }}
          >
            <img src={imageLogout} />
            <span>Выйти</span>
            <img src={imageArrowRight} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileActions;
