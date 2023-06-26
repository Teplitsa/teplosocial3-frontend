import { ReactElement } from "react";
import Link from 'next/link';
import a11yCommonStyles from "../../../inclusive-components/A11y-common.module.scss";
import styles from "./AboutCatalog.module.scss";

const AboutCatalog: React.FunctionComponent = (): ReactElement => {
  return (
    <section className={styles["about-catalog"]}>
      <h2 className={styles["about-catalog__title"]}>Что такое треки?</h2>
      <p className={styles["about-catalog__lead"]}>
        <Link href="/catalog">Загляните в каталог курсов</Link>, там точно найдёте
        что-нибудь интересное
      </p>
    </section>
  );
};

export default AboutCatalog;
