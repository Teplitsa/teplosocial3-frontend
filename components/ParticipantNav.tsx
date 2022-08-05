import {
  ReactElement,
  useState,
  MouseEvent,
  SyntheticEvent,
  useRef,
  useEffect,
} from "react";
import { useRouter } from "next/router";
import { useStoreState, useStoreActions } from "../model/helpers/hooks";
import * as profileUtils from "../model/member/profile-model";
import styles from "./ParticipantNav.module.scss";

// import imageBell from "../assets/img/bell.svg";

const ParticipantNav: React.FunctionComponent = (): ReactElement => {
  const router = useRouter();
  const menuListRef = useRef<HTMLUListElement>(null);
  const [isMenuListShown, setIsMenuListShown] = useState<boolean>(false);
  const user = useStoreState((state) => state.session.user);

  const logout = useStoreActions((state) => state.session.logout);

  const menuLinks = [
    {
      id: "my-courses",
      title: "Мои курсы",
      handleAnchorClick: (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();

        router.push("/dashboard");
      },
    },
    {
      id: "profile-settings",
      title: `Профиль <span class="${styles["user-panel__menu-link-subtitle"]}">${user.email}</span>`,
      handleAnchorClick: (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();

        router.push(`/members/${user.slug}`);
      },
    },
    {
      id: "logout",
      title: `<span class="${styles["user-panel__menu-link-logout"]}">Выйти</span>`,
      handleAnchorClick: (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();

        logout();
        router.push("/auth/login");
      },
    },
  ];

  const handleMenuButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    setIsMenuListShown((isShown) => !isShown);
  };

  const handleMenuLinkFocus = (event: SyntheticEvent<HTMLAnchorElement>) => {
    menuListRef?.current.setAttribute(
      "aria-activedescendant",
      (event.target as HTMLElement).id
    );
  };

  const handleMenuListBlur = (event: SyntheticEvent<HTMLUListElement>) => {
    menuListRef?.current.setAttribute("aria-activedescendant", null);
  };

  useEffect(() => {
    if (isMenuListShown) {
      menuListRef.current.classList.add(styles["user-panel__menu-list_active"]);
    } else {
      menuListRef.current.classList.remove(
        styles["user-panel__menu-list_active"]
      );
    }
  }, [isMenuListShown]);

  useEffect(() => {
    const menuList = menuListRef.current;
    const handleMenuListTransitionEnd = (event: Event) => {
      if ((event.target as HTMLElement).className.search(/_active/) !== -1) {
        menuList
          .querySelector<HTMLDivElement>(`.${styles["user-panel__menu-link"]}`)
          .focus();
      }
    };

    menuList.addEventListener("transitionstart", handleMenuListTransitionEnd);

    return () =>
      menuList.removeEventListener(
        "transitionstart",
        handleMenuListTransitionEnd
      );
  }, []);

  return (
    <section className={styles["user-panel"]} aria-label="Панель пользователя">
      <div className={styles["user-panel__points"]}>
        <p>
          <span className={styles["user-panel__points-caption"]}>
            Общее количество баллов:
          </span>{" "}
          {user.points}
        </p>
      </div>

      <div className={styles["user-panel__menu"]}>
        <button
          id="user-panel-menu-button"
          type="button"
          className={styles["user-panel__menu-button"]}
          aria-haspopup="true"
          aria-controls="user-panel-menu"
          aria-expanded={isMenuListShown}
          onClick={handleMenuButtonClick}
        >
          <span className={styles["user-panel__avatar"]} aria-hidden="true">
            {user.avatar && (
              <img
                className={styles["user-panel__avatar-media"]}
                src={user.avatar}
                width={40}
                height={40}
                alt={`Фотография пользователя ${profileUtils.getFullName(
                  user
                )}`}
              />
            )}
          </span>
          <span
            className={styles["user-panel__menu-button-points"]}
            aria-hidden="true"
          >
            {user.points}
          </span>
          <span className={styles["user-panel__menu-button-caption"]}>
            Меню пользователя
          </span>
        </button>
        <ul
          id="user-panel-menu"
          className={styles["user-panel__menu-list"]}
          role="menu"
          aria-labelledby="user-panel-menu-button"
          aria-activedescendant={null}
          hidden={!isMenuListShown}
          ref={menuListRef}
          onBlur={handleMenuListBlur}
        >
          {menuLinks.map(({ id, title, handleAnchorClick }) => (
            <li
              key={id}
              className={styles["user-panel__menu-item"]}
              role="none"
            >
              <a
                href="#"
                id={id}
                className={styles["user-panel__menu-link"]}
                role="menuitem"
                onFocus={handleMenuLinkFocus}
                onClick={handleAnchorClick}
                dangerouslySetInnerHTML={{ __html: title }}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ParticipantNav;
