import { ReactElement, useEffect, useState, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import * as _ from "lodash";

import { useStoreState, useStoreActions } from "../../../model/helpers/hooks";
import { IBlockState, IModuleState } from "../../../model/model.typing";
import InclusiveComponents from "../../../inclusive-components/inclusive-components";
import * as utils from "../../../utilities/utilities";
import * as modals from "../Modals";

import styles from "./AdaptestBanner.module.scss";

import imageClock from "../../../assets/img/clock-gray.svg";

const {
  ModalContext,
} = InclusiveComponents;

const AdaptestBanner: React.FunctionComponent<{
  block: IBlockState;
  mustDisplayAdaptestLink?: boolean;
}> = ({ 
  block,
  mustDisplayAdaptestLink,
}): ReactElement => {
  const router = useRouter();
  const { dispatch: modalDispatch } = useContext(ModalContext);
  const session = useStoreState((state) => state.session);

  const durationComponents = {
    hours: Math.floor(block.duration / 60),
    minutes: block.duration % 60,
  };

  return (
    <div className={styles.banner}>
      <div className={styles.bannerContent}>
        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <img src={imageClock} alt="" />
            <span>
              {durationComponents.hours > 0 ? `${durationComponents.hours} ` : ""}
              {durationComponents.hours > 0 &&
                utils.getDeclension({
                  count: durationComponents.hours,
                  caseOneItem: "час",
                  caseTwoThreeFourItems: "часа",
                  restCases: "часов",
                })}
              {durationComponents.hours > 0 && " "}
              {durationComponents.minutes > 0
                ? `${durationComponents.minutes} `
                : ""}
              {durationComponents.minutes > 0 &&
                utils.getDeclension({
                  count: durationComponents.minutes ?? 0,
                  caseOneItem: "минута",
                  caseTwoThreeFourItems: "минуты",
                  restCases: "минут",
                })}
            </span>
          </span>
        </div>

        <h2>{utils.decodeHtmlEntities(block.title.rendered)}</h2>
        <div className={styles.teaser} dangerouslySetInnerHTML={{ __html: block.excerpt.rendered}} />
        {!!mustDisplayAdaptestLink &&
          <div className={styles.startTestLink}>
            <Link href={`/adaptest/${block.slug}`}>
              <a className={styles["registration-btn"]} onClick={showRestrictedContentModal}>Пройдите адаптационный тест</a>
            </Link>
          </div>
        }
      </div>
    </div>
  );

  function showRestrictedContentModal(e) {
    if(session.isLoggedIn) {
      return;
    }

    e?.preventDefault();
    modals.registerToAccessAdaptestModal({modalDispatch, router, onClose: null});
  }
};

export default AdaptestBanner;
