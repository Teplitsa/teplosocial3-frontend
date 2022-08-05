import {
  ReactElement,
  forwardRef,
  useEffect,
  useState,
  useRef,
  FunctionComponent,
  createElement,
} from "react";
import * as _ from "lodash";

import { useStoreState, useStoreActions } from "../../../model/helpers/hooks";

import withShortcodes from "../../hoc/withShortcodes";

import { IModuleState } from "../../../model/model.typing";
import InclusiveComponents from "../../../inclusive-components/inclusive-components";
import BlockListItemOverview from "../block/BlockListItemOverview";
import * as utils from "../../../utilities/utilities";

import styles from "./ModuleListItem.module.scss";

import imageClock from "../../../assets/img/clock-gray.svg";
import imageHexagon from "../../../assets/img/t-hexagon-gray.svg";

const { Accordion, Button } = InclusiveComponents;

const ModuleListItem: React.FunctionComponent<{
  module: IModuleState;
  isOpen: boolean;
}> = ({ module, isOpen }): ReactElement => {
  const ModuleContent = withShortcodes({
    Content: forwardRef((props, ref) => (
      <template
        {...props}
        ref={ref}
        dangerouslySetInnerHTML={{ __html: module.content.rendered }}
      />
    )),
  });

  const [blockList, setBlockList] = useState([]);
  const moduleListBlockList = useStoreState(
    (state) => state.components.coursePage.moduleListBlockList
  );
  const loadBlockListByModule = useStoreActions(
    (state) => state.components.coursePage.loadBlockListByModule
  );

  const durationComponents = {
    hours: Math.floor(module.duration / 60),
    minutes: module.duration % 60,
  };

  useEffect(() => {
    loadBlockListByModule({ moduleId: module.id, doneCallback: () => {} });
  }, []);

  useEffect(() => {
    // console.log("moduleListBlockList:", moduleListBlockList);

    if (!_.isEmpty(moduleListBlockList[module.id])) {
      setBlockList(moduleListBlockList[module.id]);
    } else {
      setBlockList([]);
    }
  }, [moduleListBlockList]);

  if (!blockList || !blockList.length) {
    return null;
  }

  return (
    <div className={styles.item}>
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

        <span className={styles.metaItem}>
          <img src={imageHexagon} alt="" />
          <span>
            {module.points > 0 ? `${module.points} ` : ""}
            {module.points > 0 &&
              utils.getDeclension({
                count: module.points ?? 0,
                caseOneItem: "балл",
                caseTwoThreeFourItems: "балла",
                restCases: "баллов",
              })}
          </span>
        </span>
      </div>

      <h3 className={styles.title}>
        {utils.decodeHtmlEntities(module.title.rendered)}
      </h3>
      <div className={styles.teaser}>
        <ModuleContent />
      </div>

      <div className={styles.blocks} key={`AccordionWrapper-${module.id}`}>
        <Accordion initIndex={isOpen ? 0 : -1} key={`Accordion-${module.id}`}>
          <section>
            <h4 data-accordion-title={true}>
              <Button
                className="btn_reset"
                data-accordion-control={true}
                aria-label={`Структура модуля «${module.title.rendered}»`}
              >
                {" "}
              </Button>
            </h4>
            <div data-accordion-content={true}>
              {blockList && blockList.length > 0 && (
                <div className={styles.blockList}>
                  {blockList.map((block) => {
                    return (
                      <BlockListItemOverview
                        block={block}
                        key={`BlockListItemOverview-${block.id}`}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </Accordion>
      </div>
    </div>
  );
};

export default ModuleListItem;
