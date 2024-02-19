import { ReactElement, useEffect, useState, MouseEvent, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import {
  useStoreState,
  useStoreActions,
} from "../../../../model/helpers/hooks";
import ParticipantNav from "../../../ParticipantNav";
import Notifications from "../../partials/notifications/Notifications";
import GuestNav from "../../../GuestNav";
import InclusiveComponents from "../../../../inclusive-components/inclusive-components";
import * as C from "../../../../const";

import styles from "./HeaderContent.module.scss";

import imageLogo from "../../../../assets/img/logo.svg";

import { convertObjectToClassName } from "../../../../utilities/utilities";

const { Button } = InclusiveComponents;

const HeaderContent: React.FunctionComponent = (): ReactElement => {
  const router = useRouter();
  const navPanelRef = useRef<HTMLDivElement>(null);
  const isLoggedIn = useStoreState((store) => store.session.isLoggedIn);
  const authorizeSession = useStoreActions(
    (actions) => actions.session.authorizeSession
  );
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useEffect(() => {
    if (!process.browser) {
      return;
    }

    if (isLoggedIn) {
      return;
    }

    authorizeSession();
  }, []);

  useEffect(() => {
    const timerIds: Array<NodeJS.Timeout> = [];

    if (isPanelOpen) {
      timerIds.push(
        setTimeout(() => {
          const height = navPanelRef.current.scrollHeight;

          navPanelRef.current.style.height = `${height}px`;
          navPanelRef.current.classList.add(styles["nav-panel_expanded"]);
        }, 0)
      );

      navPanelRef.current.hidden = false;
    } else {
      timerIds.push(setTimeout(() => (navPanelRef.current.hidden = true), 300));

      navPanelRef.current.style.height = "0px";
      navPanelRef.current.classList.remove(styles["nav-panel_expanded"]);
    }

    return () => timerIds.forEach((timerId) => clearTimeout(timerId));
  }, [isPanelOpen]);

  function handleToggleBtn(event: MouseEvent<HTMLButtonElement>) {
    setIsPanelOpen((prevState) => !prevState);
  }

  return (
    <div className={styles["header-content"]}>
      <div className={styles["toggle-menu"]}>
        <Button
          className={convertObjectToClassName({
            btn_reset: true,
            [styles["toggle-menu__btn"]]: true,
            [styles["toggle-menu__btn_active"]]: isPanelOpen,
          })}
          aria-controls="nav-panel"
          aria-expanded={isPanelOpen}
          onClick={handleToggleBtn}
        >
          <span
            id="toggle-menu-btn-caption"
            className={styles["toggle-menu__btn-caption"]}
          >
            Панель навигации
          </span>
        </Button>
      </div>

      <section
        ref={navPanelRef}
        id="nav-panel"
        className={styles["nav-panel"]}
        aria-labelledby="toggle-menu-btn-caption"
      >
        <nav className={styles["main-menu"]} aria-label="Основное меню">
          <ul className={styles["main-menu__list"]}>
            <li className={styles["main-menu__item"]}>
              <Link href="/catalog">
                <a className={styles["main-menu__link"]}>Каталог курсов</a>
              </Link>
            </li>
          </ul>
        </nav>
        <aside
          className={styles["contact-menu"]}
          aria-label="Обратная связь и социальные сети"
        >
          <ul className={styles["contact-menu__list"]}>
            <li>
              <a
                className={styles["contact-us"]}
                href={`mailto:${C.TEPLO_CONTACTS.EMAIL}`}
              >
                <span aria-hidden="true">{C.TEPLO_CONTACTS.EMAIL}</span>
                <span className={styles["contact-us__caption"]}>
                  Написать нам
                </span>
              </a>
            </li>
            <li>
              <a
                className={convertObjectToClassName({
                  [styles["social-link"]]: true,
                  [styles["social-link_telegram"]]: true,
                })}
                href={C.TEPLO_CONTACTS.TELEGRAM}
                target="_blank"
              >
                <span className={styles["social-link__caption"]}>
                  Telegram-канал
                </span>
              </a>
            </li>
          </ul>
        </aside>
      </section>

      <div className={styles["logo"]}>
        {(router.pathname === "/" && (
          <img
            className={styles["logo__image"]}
            src={imageLogo}
            alt="Логотип платформы Теплица.Курсы"
          />
        )) || (
          <Link href="/">
            <a className={styles["logo__link"]}>
              <img
                className={styles["logo__image"]}
                src={imageLogo}
                alt="Логотип платформы Теплица.Курсы"
              />
              <span className={styles["logo__caption"]}>Главная страница</span>
            </a>
          </Link>
        )}
      </div>

      {router.pathname !== "/catalog" && (
        <div className={styles["standalone-header-link"]}>
          <Link href="/catalog">
            <a className={styles["course-catalog-btn"]}>Каталог курсов</a>
          </Link>
        </div>
      )}

      <div
        className={convertObjectToClassName({
          [styles["standalone-header-link"]]: true,
          [styles["standalone-header-link_align-right"]]: true,
          [styles["standalone-header-link_without-delimeter"]]: isLoggedIn,
        })}
      >
        <a
          className={convertObjectToClassName({
            [styles["telegram-chat-btn"]]: true,
            [styles["telegram-chat-btn_without-caption"]]: isLoggedIn,
          })}
          href={C.TEPLO_CONTACTS.TELEGRAM}
          target="_blank"
        >
          {!isLoggedIn && <span aria-hidden="true">Чат «Теплица.Курсы»</span>}
          <span className={styles["telegram-chat-btn__caption"]}>
            Telegram-канал «Теплица.Курсы»
          </span>
        </a>
      </div>
      <div
        className={convertObjectToClassName({
          "account-col": true,
          "logged-in": isLoggedIn,
          [styles["header-content__align-right"]]: true,
        })}
      >
        {isLoggedIn && <Notifications />}
        {(isLoggedIn && <ParticipantNav />) || <GuestNav />}
      </div>
    </div>
  );
};

export default HeaderContent;
