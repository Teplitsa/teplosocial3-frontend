import { ReactElement, useRef, useState, useEffect } from "react";
import { IInputTextProps } from "../../inclusive-components.typing";
import { convertObjectToClassName } from "../../../utilities/utilities";
import styles from "./InputText.module.scss";

const InputText: React.FunctionComponent<IInputTextProps> = ({
  label,
  className,
  ...props
}): ReactElement => {
  const classNameString = [
    styles["input"],
    styles["input_text"],
    className?.split(" ").map((className) => styles[className] ?? className) ??
      [],
  ].join(" ");

  const inputRef = useRef<HTMLInputElement>(null);
  const [isEdited, setIsEdited] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const inputElement = inputRef.current;
    const formElement = inputElement?.form;
    const handleFormSubmit = () => setIsEdited(true);
    const handleInputBlur = () => setIsEdited(true);

    formElement?.addEventListener("submit", handleFormSubmit);

    inputElement?.addEventListener("blur", handleInputBlur);

    return () => {
      formElement?.removeEventListener("submit", handleFormSubmit);
      inputElement?.removeEventListener("blur", handleInputBlur);
    }
  }, [inputRef.current]);

  useEffect(() => {
    if (!label && !props["aria-label"]) {
      console.error("Label or aria-label attribute must be specified.");
    }
  }, [label, props["aria-label"]]);

  useEffect(() => {
    const isValid = inputRef.current.checkValidity();

    if (isValid && hasError) {
      setHasError(false);
    } else if (!isValid && !hasError) {
      setHasError(true);
    }
  }, [hasError, props["value"]]);

  return (
    <div
      className={convertObjectToClassName({
        [styles["input-wrapper"]]: true,
        [styles["input-wrapper_has-error"]]: isEdited && hasError,
      })}
    >
      {label ? (
        <label className={styles["input-label"]}>
          <input
            ref={inputRef}
            className={classNameString}
            type="text"
            {...props}
          />
          <span className={styles["input-label__text"]}>{label}</span>
        </label>
      ) : (
        <input
          ref={inputRef}
          className={classNameString}
          type="text"
          {...props}
        />
      )}
    </div>
  );
};

export default InputText;
