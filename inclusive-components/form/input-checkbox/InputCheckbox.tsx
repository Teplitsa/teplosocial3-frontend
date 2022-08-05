import { ReactElement, useEffect } from "react";
import { IInputCheckboxProps } from "../../inclusive-components.typing";
import styles from "./InputCheckbox.module.scss";

const InputCheckbox: React.FunctionComponent<IInputCheckboxProps> = ({
  label,
  className,
  ...props
}): ReactElement => {
  const classNameString = [
    styles["input-checkbox"],
    className?.split(" ").map((className) => styles[className] ?? className) ??
      [],
  ].join(" ");

  useEffect(() => {
    if (!label && !props["aria-label"]) {
      console.error("Label or aria-label attribute must be specified.");
    }
  }, []);

  return (
    <div className={styles["input-checkbox-wrapper"]}>
      {label ? (
        <label className={styles["input-checkbox-label"]}>
          <input className={classNameString} {...props} type="checkbox" />
          <span className={styles["input-checkbox-label__text"]}>{label}</span>
        </label>
      ) : (
        <input className={classNameString} {...props} type="checkbox" />
      )}
    </div>
  );
};

export default InputCheckbox;
