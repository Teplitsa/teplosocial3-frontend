import { ReactElement } from "react";
import Link from "next/link";
import styles from "./FooterNav.module.scss";

const FooterNav: React.FunctionComponent = (): ReactElement => {
  return (
    <div className={styles.menuList}>
      <nav className="main-menu" aria-label="Основное меню">
        <Link href="/team">
          <a>Команда</a>
        </Link>
        <Link href="/about">
          <a>О проекте</a>
        </Link>
        {/*
        <Link href="/">
          <a>Награды и баллы</a>
        </Link>
        */}
      </nav>
      <div className={styles.rss}>
        <a href="/feed/" target="_blank">
          RSS-канал
        </a>
      </div>
    </div>
  );
};

export default FooterNav;
