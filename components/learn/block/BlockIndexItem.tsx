import { ReactElement, useEffect, useState, MouseEvent } from "react";
import * as _ from "lodash";
import Link from "next/link";

import { useStoreState, useStoreActions } from "../../../model/helpers/hooks";

import {
  IBlockState,
} from "../../../model/model.typing";

import styles from './BlockIndexItem.module.scss'

const BlockListItem: React.FunctionComponent<{block: IBlockState}> = ({block}): ReactElement => {
  const currentblock = useStoreState(state => state.components.blockPage.block);
  const setIsCourseIndexOpen = useStoreActions(actions => actions.components.blockPage.setIsCourseIndexOpen);

  const [indexItemClassName, setIndexItemClassName] = useState(styles.itemInactive);

  useEffect(() => {
    if(currentblock.slug === block.slug) {
      setIndexItemClassName(styles.item);
    }
    else if(block.isCompleted) {
      setIndexItemClassName(block.isCompletedByAdaptest ? styles.itemCompletedByAdaptest : styles.itemCompleted);
    }
  }, [block]);

  return (
    <div className={indexItemClassName}>
      <div className={styles.icon}>
        <div> </div>
      </div>
      <div className={styles.content}>
        <Link href={`/blocks/${block.slug}`}>
          <a
            onClick={() => {
              setIsCourseIndexOpen(false);
            }}
          >
            <h5 dangerouslySetInnerHTML={{ __html: block.title.rendered}} />
          </a>
        </Link>
      </div>
    </div>
  );
};

export default BlockListItem;
