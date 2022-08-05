import { ReactElement, useEffect, useState, MouseEvent, useContext } from "react";
import { useRouter } from "next/router";
import * as _ from "lodash";
import Link from "next/link";

import { useStoreState, useStoreActions } from "../../../model/helpers/hooks";
import { IBlockState } from "../../../model/model.typing";
import InclusiveComponents from "../../../inclusive-components/inclusive-components";
import * as modals from "../Modals";

import styles from "./BlockListItemOverview.module.scss";

import imageBlockPointVideo from "../../../assets/img/block-point-video.svg";
import imageBlockPointStar from "../../../assets/img/block-point-star.svg";
import imageBlockPointText from "../../../assets/img/block-point-text.svg";
import imageBlockPointTest from "../../../assets/img/block-point-test.svg";

const {
  ModalContext,
} = InclusiveComponents;

const blockIcons = {
  video: imageBlockPointVideo,
  test: imageBlockPointTest,
  text: imageBlockPointText,
};

const BlockListItemOverview: React.FunctionComponent<{
  block: IBlockState;
}> = ({
  block,
}): ReactElement => {
  const router = useRouter();
  const { dispatch: modalDispatch } = useContext(ModalContext);
  const session = useStoreState((state) => state.session);
  const blockIcon =
    block.isFinalInModule &&
    (block.contentType === "test" || block.contentType === "task")
      ? imageBlockPointStar
      : blockIcons[block.contentType] ?? imageBlockPointText;

  return (
    <div className={styles.item}>
      <div className={styles.icon}>
        <img src={blockIcon} alt="" />
      </div>
      <div className={styles.content}>
        <span className={styles.contentLink}>      
          <Link href={`/blocks/${block.slug}`}>
            <a dangerouslySetInnerHTML={{ __html: block.title.rendered }} onClick={showRestrictedContentModal}/>
          </Link>
        </span>
      </div>
    </div>
  );

  function showRestrictedContentModal(e) {
    if(session.isLoggedIn || block.isAvailableForGuest) {
      return;
    }

    e?.preventDefault();

    if(block.contentType === "task") {
      modals.registerToAccessTaskModal({modalDispatch, router, onClose: null});
    }
    else {
      modals.registerToContinueModal({modalDispatch, router, onClose: null});
    }
  }
};

export default BlockListItemOverview;
