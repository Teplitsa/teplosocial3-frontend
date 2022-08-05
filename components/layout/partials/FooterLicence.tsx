import { ReactElement } from "react";

import styles from "./FooterLicence.module.scss";

const FooterLicence: React.FunctionComponent = (): ReactElement => {
  return (
    <div className={styles.licence}>
      <div>
        <p>
          Сделано на{" "}
          <a
            className={styles.designStudio}
            href="http://www.verstak.ru/"
            target="_blank"
          >
            <span aria-hidden="true">Верстаке</span>
            <span className={styles.designStudioCaption}>
              Дизайн-бюро «Верстак»
            </span>
          </a>
        </p>
        <p>
          Разработка&nbsp;—&nbsp;
          <a href="https://te-st.ru" target="_blank">
            Теплица социальных технологий
          </a>
        </p>
      </div>

      <div>
        <p className={styles.licenceText}>
          Материалы сайта доступны по лицензии{" "}
          <a
            href="https://creativecommons.org/licenses/by-sa/4.0/deed.ru"
            target="_blank"
          >
            Creative Commons СС-BY-SA. 4.0
          </a>
        </p>
      </div>
    </div>
  );
};

export default FooterLicence;
