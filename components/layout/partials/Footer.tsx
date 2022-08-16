import { ReactElement } from "react";

import styles from "./Footer.module.scss";

const Footer: React.FunctionComponent = ({ children }): ReactElement => {
  return (
    <footer className={styles.siteFooter}>
      <div className={styles.footerInner}>{children}</div>
    </footer>
  );
};

export default Footer;

// this is just a test
