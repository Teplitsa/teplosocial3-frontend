import { ReactElement, useEffect, Fragment, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import * as _ from "lodash";

import { useStoreState } from "../../../../model/helpers/hooks";
import * as C from "../../../../const";
import LoginForm from "../../../auth/login-form/LoginForm";
import Logo from "../../../../inclusive-components/media/logo/Logo";

import styles from "../login/Login.module.scss";
import stylesAccountActivated from "./AccountActivated.module.scss";

const AccountActivated: React.FunctionComponent = (props:any): ReactElement => {
  const router = useRouter()
  const session = useStoreState(state => state.session)
  
  return (
    <main className={styles["login-page"]}>
      <section className={styles["login-page__content"]}>
        {router.query.status === "ok" &&
          <>
            <div className={styles["login-page__logo"]}>
              <Logo align="center" />
            </div>
            <h2 className={stylesAccountActivated.message}>Ваш аккаунт успешно подтвержден!</h2>
            {!session.isLoggedIn &&
              <div className={stylesAccountActivated.loginForm}>
                <LoginForm />
              </div>
            }
          </>
        }
        {router.query.status !== "ok" &&
          <>
            <div className={styles["login-page__logo"]}>
              <Logo align="center" />
            </div>
            <h2 className={stylesAccountActivated.message}>При подтверждении аккаунта произошла ошибка. Пожалуйста <a href={`mailto:${C.TEPLO_CONTACTS.EMAIL}`}>сообщите об этом</a> администрации сайта.</h2>
          </>
        }
      </section>
    </main>
  );
};

export default AccountActivated;
