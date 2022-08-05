import { ReactElement } from "react";
import { useRouter } from "next/router";
import * as _ from "lodash";
import Link from "next/link";

import { IProfileState } from "../../../model/model.typing";
import InclusiveComponents from "../../../inclusive-components/inclusive-components";

import styles from "./ProfileDescription.module.scss";

const { Button } = InclusiveComponents;

const ProfileDescription: React.FunctionComponent<{
  profile: IProfileState;
}> = ({ profile }): ReactElement => {
  const router = useRouter();

  return (
    <>
      {_.isEmpty(profile.description) ? (
        <div className={styles.emptyProfile}>
          <h5>Профиль не заполнен</h5>
          <p>
            Добавьте данные о себе, чтобы мы лучше понимали, что вам
            рекомендовать.
          </p>
        </div>
      ) : (
        <div className={styles.content}>
          <h5 className={styles.title}>{"О себе"}</h5>
          <div className={styles.description}>{profile.description}</div>
        </div>
      )}
    </>
  );
};

export default ProfileDescription;
