import { ReactElement, useState, } from "react";

import Loader from "../../../Loader";
import ForgotPasswordForm from "../../../auth/forgot-password-form/ForgotPasswordForm";
import Logo from "../../../../inclusive-components/media/logo/Logo";
import styles from "./ForgotPassword.module.scss";

const ForgotPassword: React.FunctionComponent = (): ReactElement => {
  const [isPasswordSent, setIsPasswordSent] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  return (
    <main className={styles["forgot-password-page"]}>
      <section className={styles["forgot-password-page__content"]}>
        <div className={styles["forgot-password-page__logo"]}>
          <Logo align="center" />
        </div>
        {actionLoading && <Loader />}
        {!isPasswordSent && !actionLoading &&
          <>
            <h1 className={styles["forgot-password-page__title"]}>
              Забыли пароль?
            </h1>
            <div className={styles["forgot-password-page__text"]} role="paragraph">
              Чтобы сбросить пароль, введите свой электронный адрес. Если письмо не
              пришло, обязательно проверьте папку со спамом.
            </div>
            <ForgotPasswordForm setIsPasswordSent={setIsPasswordSent} setActionLoading={setActionLoading} />
          </>
        }
        {isPasswordSent && !actionLoading &&
          <>
            <h1 className={styles["forgot-password-page__title"]}>
              Проверьте почту
            </h1>
            <div className={styles["forgot-password-page__text"]} role="paragraph">
              Мы отправили туда ссылку для смены пароля.
            </div>
          </>
        }
      </section>
    </main>
  );
};

export default ForgotPassword;
