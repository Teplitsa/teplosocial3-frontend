import { ReactElement } from "react";
import ResetPasswordForm from "../../../auth/reset-password-form/ResetPasswordForm";
import Logo from "../../../../inclusive-components/media/logo/Logo";
import styles from "./ResetPassword.module.scss";

const ResetPassword: React.FunctionComponent = (): ReactElement => {
  return (
    <main className={styles["reset-password-page"]}>
      <section className={styles["reset-password-page__content"]}>
        <div className={styles["reset-password-page__logo"]}>
          <Logo align="center" />
        </div>
        <h1 className={styles["reset-password-page__title"]}>
          Восстановление пароля
        </h1>
        <ResetPasswordForm />
      </section>
    </main>
  );
};

export default ResetPassword;
