import { ReactElement, useEffect, useState } from "react";

import { useStoreState, useStoreActions } from "../../../model/helpers/hooks";
import * as utils from "../../../utilities/utilities";

import { IModuleState } from "../../../model/model.typing";
import * as guestPassingState from "../../../model/learn/guest-passing-state";
import InclusiveComponents from "../../../inclusive-components/inclusive-components";
import BlockIndexItem from "../block/BlockIndexItem";

import styles from "./ModuleIndexItem.module.scss";

const { Accordion, Button } = InclusiveComponents;

const ModuleIndexItem: React.FunctionComponent<{
  module: IModuleState;
  isOpen: boolean;
}> = ({ module, isOpen }): ReactElement => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [blockList, setBlockList] = useState(null);
  const block = useStoreState((state) => state.components.blockPage.block);
  const session = useStoreState(state => state.session);
  const moduleListBlockList = useStoreState(
    (state) => state.components.coursePage.moduleListBlockList
  );
  const loadBlockListByModule = useStoreActions(
    (state) => state.components.coursePage.loadBlockListByModule
  );
  const [indexItemClassName, setIndexItemClassName] = useState(styles.itemInactive);

  useEffect(() => {
    if (typeof moduleListBlockList[module.id] === "undefined") {
      loadBlockListByModule({
        moduleId: module.id,
        doneCallback: () => setIsLoading(false),
      });
    } else {
      setBlockList([...moduleListBlockList[module.id].map(b => {
        return {
          ...b,
          isCompleted: session.isLoggedIn ? b.isCompleted : guestPassingState.isBlockCompletedByGuest(b, module),
        }
      })]);

      setIsLoading(false);
    }
  }, [moduleListBlockList]);

  useEffect(() => {
    if(block.moduleSlug === module.slug) {
      setIndexItemClassName(styles.item);
    }
    else if(module.isCompleted) {
      setIndexItemClassName(module.isCompletedByAdaptest ? styles.itemCompletedByAdaptest : styles.itemCompleted);
    }
  }, [module]);

  if (isLoading) {
    return null;
  }

  return (
    <div className={indexItemClassName}>
      <div className={styles.icon}>
        <div> </div>
      </div>
      <Accordion initIndex={isOpen ? 0 : -1}>
        <section>
          <h5 data-accordion-title={true}>
            <Button
              className="btn_reset"
              data-accordion-control={true}
              aria-label={`Модуль ${module.title.rendered}`}
            >
              {utils.decodeHtmlEntities(module.title.rendered)}
            </Button>
          </h5>
          <div data-accordion-content={true}>
            {blockList !== null &&
              blockList.map((block) => {
                return (
                  <BlockIndexItem
                    block={block}
                    key={`BlockIndexItem-${block.id}`}
                  />
                );
              })}
          </div>
        </section>
      </Accordion>
    </div>
  );
};

export default ModuleIndexItem;
