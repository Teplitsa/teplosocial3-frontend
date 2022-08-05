import { ReactElement, useRef, useState, useEffect, MouseEvent } from "react";
import { IInputTextProps } from "../../inclusive-components.typing";
import { convertObjectToClassName } from "../../../utilities/utilities";
import Button from "../button/Button";
import styles from "./InputSearch.module.scss";

const InputSearch: React.FunctionComponent<IInputTextProps> = ({
  label,
  className,
  wrapperClassName,
  ...props
}): ReactElement => {
  const classNameString = [
    styles["input"],
    styles["input_search"],
    className?.split(" ").map((className) => styles[className] ?? className) ??
      [],
  ].join(" ");

  const wrapperClassList = [
    styles["input-wrapper"],
    ...(wrapperClassName
      ?.split(" ")
      .map((className) => styles[className] ?? className) ?? []),
  ];

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

  function resetBtnClickHandle(event: MouseEvent<HTMLButtonElement>) {
    inputRef.current.value = "";
    inputRef.current.dispatchEvent(new Event("input", { bubbles: true }));
  }

  return (
    <div
      className={convertObjectToClassName({
        ...wrapperClassList.reduce((object, className) => {
          object[className] = true;
          return object;
        }, {}),
        [styles["input-wrapper_filled-in"]]: props["value"] !== "",
        [styles["input-wrapper_has-error"]]: isEdited && hasError,
      })}
    >
      <Button
        className={convertObjectToClassName({
          btn_reset: true,
          [styles["input-reset-btn"]]: true,
          [styles["input-reset-btn_disabled"]]: props["value"] === "",
        })}
        aria-controls={props["id"] || styles["input_search"]}
        disabled={props["value"] === ""}
        onClick={resetBtnClickHandle}
      >
        <span className={styles["input-reset-btn__caption"]}>Очистить</span>
      </Button>
      {label ? (
        <label className={styles["input-label"]}>
          <input
            {...props}
            ref={inputRef}
            className={classNameString}
            type="search"
          />
          <span className={styles["input-label__text"]}>{label}</span>
        </label>
      ) : (
        <input
          id={styles["input_search"]}
          {...props}
          ref={inputRef}
          className={classNameString}
          type="search"
        />
      )}
    </div>
  );
};

export default InputSearch;
