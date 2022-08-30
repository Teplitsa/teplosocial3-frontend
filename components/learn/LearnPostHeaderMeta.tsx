import { ReactElement, useState } from "react";
import Link from "next/link";

import { ILearnPostState } from "../../model/model.typing";
import InclusiveComponents from "../../inclusive-components/inclusive-components";
import {
  convertObjectToClassName,
  getDeclension,
} from "../../utilities/utilities";

import commonStyles from "../../inclusive-components/A11y-common.module.scss";
import styles from "./LearnPostHeaderMeta.module.scss";

import imageClock from "../../assets/img/clock-white.svg";
import imageHexagon from "../../assets/img/t-hexagon-white.svg";
import imageQuestion from "../../assets/img/question-rounded.svg";
import HintTooltip from "components/HintTooltip";
import { roundDownMinutes } from "utilities/roundDownMinutes";

const { Button, Tooltip } = InclusiveComponents;

const LearnPostHeaderMeta: React.FunctionComponent<{
  post: ILearnPostState;
  aboutLink?: any;
  connectedType?: {
    title: string;
    slug: string;
  };
}> = ({ post, aboutLink = null, connectedType = null }): ReactElement => {
  const durationComponents = {
    hours: Math.floor(post.duration / 60),
    minutes: roundDownMinutes(post.duration),
  };
  const [showHint, setShowHint] = useState(false);

  return (
    <div className={styles.metaBar}>
      <div className={styles.metaInfo}>
        {connectedType?.slug && connectedType?.title && (
          <span className={styles.metaItem}>
            <Link href={`/tracks/${connectedType.slug}`}>
              <a className={styles.connectedType}>{connectedType.title}</a>
            </Link>
          </span>
        )}

        <span className={styles.metaItem}>
          <img src={imageClock} alt="" />
          <span
            className={styles.onHover}
            onMouseEnter={() => setShowHint(true)}
            onMouseLeave={() => setShowHint(false)}
          >
            {durationComponents.hours > 0 ? `${durationComponents.hours} ` : ""}
            {durationComponents.hours > 0 &&
              getDeclension({
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
              getDeclension({
                count: durationComponents.minutes ?? 0,
                caseOneItem: "минута",
                caseTwoThreeFourItems: "минуты",
                restCases: "минут",
              })}
            {showHint && <HintTooltip />}
          </span>
        </span>

        <span className={styles.metaItem}>
          <img src={imageHexagon} alt="" />
          <span>{post.points} баллов</span>
        </span>

        <div className={styles.question}>
          <Tooltip
            content={() => (
              <p>
                Это количество баллов, которое ты получишь после прохождения
                курса. За закрытие каждого блока тебе начисляется 10 баллов.
              </p>
            )}
          >
            <Button
              style={{ display: "flex" }}
              className={convertObjectToClassName({
                btn_reset: true,
                [commonStyles["focusable"]]: true,
              })}
            >
              <img src={imageQuestion} alt="" aria-hidden={true} />
              <span className={commonStyles["visually-hidden"]}>
                Задать вопрос
              </span>
            </Button>
          </Tooltip>
        </div>
      </div>

      {aboutLink}
    </div>
  );
};

export default LearnPostHeaderMeta;
