import React from "react";
import styles from "./HintTooltip.module.scss";

interface IHintTooltip {}

const HintTooltip: React.FunctionComponent<IHintTooltip> = ({
  text,
}: {
  text?: string;
}) => {
  const defaultText = "Примерное время на освоение материалов курса";
  return (
    <div className={styles.wrapper}>
      <p className={styles.text}>{text ? text : defaultText}</p>
    </div>
  );
};

export default HintTooltip;
