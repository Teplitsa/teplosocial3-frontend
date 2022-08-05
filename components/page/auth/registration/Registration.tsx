import { ReactElement } from "react";
import RegistrationForm from "../../../auth/registration-form/RegistrationForm";
import Logo from "../../../../inclusive-components/media/logo/Logo";
import a11yCommonStyles from "../../../../inclusive-components/A11y-common.module.scss";
import styles from "./Registration.module.scss";

const Registration: React.FunctionComponent = (): ReactElement => {
  return (
    <main className={styles["registration-page"]}>
      <section className={styles["registration-page__content"]}>
        <h1 className={a11yCommonStyles["visually-hidden"]}>Регистрация</h1>
        <div className={styles["registration-page__logo"]}>
          <Logo align="center" />
        </div>
        <RegistrationForm />
      </section>
    </main>
  );
};

export default Registration;
