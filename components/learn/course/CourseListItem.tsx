import { ReactElement } from "react";
import * as _ from "lodash";

import { ICourseState, IModuleState } from "../../../model/model.typing";
import ModuleListItem from "../module/ModuleListItem";
import InclusiveComponents from "../../../inclusive-components/inclusive-components";
import * as utils from "../../../utilities/utilities";

import styles from "../module/ModuleListItem.module.scss";
import stylesCourseListItem from "./CourseListItem.module.scss";

import imageClock from "../../../assets/img/clock-gray.svg";
import imageHexagon from "../../../assets/img/t-hexagon-gray.svg";
import imageClockOpen from "../../../assets/img/clock-black.svg";
import imageHexagonOpen from "../../../assets/img/t-hexagon-black.svg";

const { Accordion, Button } = InclusiveComponents;

const CourseListItem: React.FunctionComponent<{
  course: ICourseState;
  moduleList: Array<IModuleState>;
}> = ({ course, moduleList }): ReactElement => {
  const isOpen = !_.isEmpty(moduleList);

  if (!moduleList?.length) {
    return null;
  }

  return (
    <div
      className={stylesCourseListItem.item}
      key={`AccordionWrapper-${course.id}`}
    >
      <Accordion theme="arrow-control" key={`Accordion-${course.id}`}>
        <section>
          <h2 data-accordion-title={true}>
            <Button
              className="btn_reset"
              data-accordion-control={true}
              aria-label={`Структура курса «${course.title.rendered}»`}
            >
              <div className={styles.meta}>
                <span className={styles.metaItem}>
                  <img src={imageClockOpen} className="metaIconDark" alt="" />
                  <img src={imageClock} className="metaIconLight" alt="" />
                  <span>{course.duration}</span>
                </span>

                <span className={styles.metaItem}>
                  <img src={imageHexagonOpen} className="metaIconDark" alt="" />
                  <img src={imageHexagon} className="metaIconLight" alt="" />
                  <span>{course.points}</span>
                </span>
              </div>

              {utils.decodeHtmlEntities(course.title.rendered)}
            </Button>
          </h2>
          <div data-accordion-content={true}>
            {moduleList && moduleList.length > 0 && (
              <div className={stylesCourseListItem.modules}>
                {moduleList.map((module) => {
                  return (
                    <ModuleListItem
                      key={`CourseModule${module.id}`}
                      module={module}
                      isOpen={false}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </Accordion>
    </div>
  );
};

export default CourseListItem;
