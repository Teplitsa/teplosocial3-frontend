import { ReactElement, useEffect } from "react";
import { IInputCheckboxProps } from "../../inclusive-components.typing";
import styles from "./InputRadio.module.scss";

const InputRadio: React.FunctionComponent<IInputCheckboxProps> = ({
  label,
  className,
  ...props
}): ReactElement => {
  const classNameString = [
    styles["input-radio"],
    className?.split(" ").map((className) => styles[className] ?? className) ??
      [],
  ].join(" ");

  useEffect(() => {
    if (!label && !props["aria-label"]) {
      console.error("Label or aria-label attribute must be specified.");
    }
  }, []);

  return (
    <div className={styles["input-radio-wrapper"]}>
      {label ? (
        <label className={styles["input-radio-label"]}>
          <input className={classNameString} {...props} type="radio" />
          <span className={styles["input-radio-label__text"]}>{label}</span>
        </label>
      ) : (
        <input className={classNameString} {...props} type="radio" />
      )}
    </div>
  );
};

export default InputRadio;
