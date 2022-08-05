import { ReactElement, useRef, useState, useEffect } from "react";
import { IInputTextProps } from "../../inclusive-components.typing";
import { convertObjectToClassName } from "../../../utilities/utilities";
import styles from "./InputFile.module.scss";

const InputFile: React.FunctionComponent<IInputTextProps> = ({
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
  const [fileName, setFileName] = useState(props.placeholder);

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
    };
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
          <div className={styles.fileInputContainer}>
            <input
              ref={inputRef}
              type="file"
              {...props}
              onChange={(event) => {
                if (!event.currentTarget.files[0]) return;

                const fileName = event.currentTarget.files[0].name.replace(
                  /^.*\//,
                  ""
                );
                setFileName(fileName);

                if (props.onChange) {
                  props.onChange(event);
                }
              }}
            />
            <div className={classNameString}>{fileName}</div>
          </div>
          <span className={styles["input-label__text"]}>{label}</span>
        </label>
      ) : (
        <div className={styles.fileInputContainer}>
          <input
            ref={inputRef}
            type="file"
            {...props}
            onChange={(event) => {
              if (!event.currentTarget.files[0]) return;

              const fileName = event.currentTarget.files[0].name.replace(
                /^.*\//,
                ""
              );
              setFileName(fileName);

              if (props.onChange) {
                props.onChange(event);
              }
            }}
          />
          <div className={classNameString}>{fileName}</div>
        </div>
      )}
    </div>
  );
};

export default InputFile;
