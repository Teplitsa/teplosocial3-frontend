import { ReactElement } from "react";
import Link from "next/link";

import * as C from "../../../const";

import styles from "./FooterSocial.module.scss"

import imageFb from "../../../assets/img/social-fb-white.svg";
import imageVk from "../../../assets/img/social-vk-white.svg";
import imageTg from "../../../assets/img/social-tg-white.svg";
import imageRss from "../../../assets/img/social-rss-white.svg";

const FooterSocial: React.FunctionComponent = (): ReactElement => {
  return (
    <div className={styles.container}>
      <div className={styles.contact}>
        По любым вопросам пишите<br />на почту <a href={`mailto:${C.TEPLO_CONTACTS.EMAIL}`} target="_blank">{C.TEPLO_CONTACTS.EMAIL}</a><br />или в <a href={C.TEPLO_CONTACTS.TELEGRAM} target="_blank">телеграм-чат</a>.
      </div>
      <div className={styles.rss}>
        <a href="/feed/" target="_blank">RSS-канал</a>        
      </div>
    </div>
  );
};

export default FooterSocial;
