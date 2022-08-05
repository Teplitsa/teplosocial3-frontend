import { ReactElement } from "react";
import { IProgressBarProps } from "../inclusive-components.typing";
import { convertObjectToClassName } from "../../utilities/utilities";
import styles from "./ProgressBar.module.scss";

const ProgressBar: React.FunctionComponent<IProgressBarProps> = ({
  valueMin = 0,
  valueMax = 100,
  valueNow = 0,
  valueText,
  label,
  disabled,
  visibleText,
  footerAlign = "space-between",
  children,
}): ReactElement => {
  return (
    <div
      className={styles["progress"]}
      tabIndex={0}
      role="progressbar"
      aria-valuemin={valueMin}
      aria-valuemax={valueMax}
      aria-valuenow={valueNow ?? null}
      aria-valuetext={valueText ?? null}
      aria-label={label ?? null}
    >
      <div
        className={convertObjectToClassName({
          [styles["progress__bar"]]: true,
          [styles["progress__bar_disabled"]]:
            disabled && Boolean(styles["progress__bar_disabled"]),
        })}
      >
        {!disabled && (
          <div
            className={styles["progress__value"]}
            style={{
              width: `${(valueNow / ((valueMin + valueMax) / 100)).toFixed(
                2
              )}%`,
            }}
          />
        )}
      </div>
      <div
        className={convertObjectToClassName({
          [styles["progress__footer"]]: true,
          [styles[`progress__footer_${footerAlign}`]]: Boolean(
            styles[`progress__footer_${footerAlign}`]
          ),
        })}
      >
        {visibleText && (
          <div className={styles["progress__text"]}>{visibleText}</div>
        )}
        {children && (
          <div className={styles["progress__extra_content"]}>{children}</div>
        )}
      </div>
    </div>
  );
};

export default ProgressBar;
