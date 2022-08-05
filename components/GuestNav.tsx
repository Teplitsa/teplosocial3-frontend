import { ReactElement } from "react";
import Link from "next/link";
import styles from "./GuestNav.module.scss";

const GuestNav: React.FunctionComponent = (): ReactElement => {
  return (
    <>
      <Link href="/auth/registration">
        <a className={styles["registration-btn"]}>Регистрация</a>
      </Link>
      <Link href="/auth/login">
        <a className={styles["login-btn"]}>
          <span aria-hidden="true">Войти</span>
          <span className={styles["login-btn__caption"]}>
            Вход в личный кабинет
          </span>
        </a>
      </Link>
    </>
  );
};

export default GuestNav;
