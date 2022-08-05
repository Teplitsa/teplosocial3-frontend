import { ReactElement } from "react";
import LoginForm from "../../../auth/login-form/LoginForm";
import Logo from "../../../../inclusive-components/media/logo/Logo";
import a11yCommonStyles from "../../../../inclusive-components/A11y-common.module.scss";
import styles from "./Login.module.scss";

const Login: React.FunctionComponent = (): ReactElement => {
  return (
    <main className={styles["login-page"]}>
      <section className={styles["login-page__content"]}>
        <h1 className={a11yCommonStyles["visually-hidden"]}>Вход в систему</h1>
        <div className={styles["login-page__logo"]}>
          <Logo align="center" />
        </div>
        <LoginForm />
      </section>
    </main>
  );
};

export default Login;
