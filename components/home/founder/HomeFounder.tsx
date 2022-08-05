import { ReactElement } from "react";
import TeplitsaLogo from "./img/teplitsa-logo.svg";
import a11yCommonStyles from "../../../inclusive-components/A11y-common.module.scss";
import styles from "./HomeFounder.module.scss";

const HomeFounder: React.FunctionComponent = (): ReactElement => {
  return (
    <section className={styles["home-founder"]}>
      <h2 className={a11yCommonStyles["visually-hidden"]}>Об организаторе</h2>
      <div className={styles["home-founder__content"]}>
        <a
          href="https://te-st.ru"
          target="_blank"
          title="Перейти на сайт Теплицы социальных технологий"
        >
          <img
            src={TeplitsaLogo}
            width="247"
            height="135"
            alt="Логотип Теплицы социальных технологий"
          />
        </a>
        <p>
          Теплица социальных технологий — просветительский проект, миссия
          которого сделать некоммерческий сектор России сильным и независимым с
          помощью информационных технологий.
        </p>
      </div>
    </section>
  );
};

export default HomeFounder;
