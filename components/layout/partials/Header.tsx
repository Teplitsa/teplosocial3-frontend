import { ReactElement } from "react";

import styles from "./Header.module.scss"

const Header: React.FunctionComponent = ({ children }): ReactElement => {
  //const user = useStoreState((store) => store.user.data);
  const gaContent = `
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.googletagmanager.com/gtag/js?id=G-G58WVFHKBP','gtag');

window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-G58WVFHKBP');

`;

  return (
    <header className={styles.siteHeaderWrapper}>
      <div className={styles.siteHeader}>
        {children}
      </div>
      <script dangerouslySetInnerHTML={{ __html: gaContent }}></script>
    </header>
  );
};

export default Header;
