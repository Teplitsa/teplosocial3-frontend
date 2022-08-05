import { ReactElement, useState, MouseEvent } from "react";
import { useRouter } from "next/router";
import { useStoreState } from "../../../../model/helpers/hooks";
import Loader from "../../../Loader";
import ChangePasswordForm from "../../../auth/change-password-form/ChangePasswordForm";
import InclusiveComponents from "../../../../inclusive-components/inclusive-components";
import styles from "./ChangePassword.module.scss";

const { Button } = InclusiveComponents;

const ChangePassword: React.FunctionComponent = (): ReactElement => {
  const router = useRouter();
  const user = useStoreState((state) => state.session.user);
  const [isPasswordSent, setIsPasswordSent] = useState(false);
  const [processing, setProcessing] = useState(false);

  function goToProfileButtonClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    router.push(`/members/${user.slug}`);
  }

  return (
    <main className={styles["change-password-page"]}>
      <section className={styles["change-password-page__content"]}>
        <h1 className={styles["change-password-page__title"]}>
          Сменить пароль
        </h1>
        {processing && <Loader />}
        {isPasswordSent && !processing && (
          <>
            <div
              className={styles["change-password-page__text"]}
              role="paragraph"
            >
              Ваш пароль успешно сохранен.
            </div>
            <Button
              className="btn_primary"
              tabIndex={0}
              role="link"
              data-href="/"
              onClick={goToProfileButtonClick}
            >
              Перейти в профиль
            </Button>
          </>
        )}
        {!isPasswordSent && !processing && (
          <ChangePasswordForm {...{ setIsPasswordSent, setProcessing }} />
        )}
      </section>
    </main>
  );
};

export default ChangePassword;
