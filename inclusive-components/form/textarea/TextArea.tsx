import { ReactElement, useRef, useState, useEffect } from "react";
import { ITextAreaProps } from "../../inclusive-components.typing";
import { convertObjectToClassName } from "../../../utilities/utilities";
import styles from "./TextArea.module.scss";

const TextArea: React.FunctionComponent<ITextAreaProps> = ({
  label,
  className,
  ...props
}): ReactElement => {
  const classNameString = [
    styles["textarea"],
    className?.split(" ").map((className) => styles[className] ?? className) ??
      [],
  ].join(" ");

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [isEdited, setIsEdited] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!label && !props["aria-label"]) {
      console.error("Label or aria-label attribute must be specified.");
    }

    textAreaRef.current.addEventListener(
      "focus",
      () => !isEdited && setIsEdited(true)
    );
  }, []);

  useEffect(() => {
    const isValid = textAreaRef.current.checkValidity();

    if (isValid && hasError) {
      setHasError(false);
    } else if (!isValid && !hasError) {
      setHasError(true);
    }
  }, [props["value"]]);

  return (
    <div
      className={convertObjectToClassName({
        [styles["textarea-wrapper"]]: true,
        [styles["textarea-wrapper_has-error"]]: isEdited && hasError,
      })}
    >
      {label ? (
        <label className={styles["textarea-label"]}>
          <textarea ref={textAreaRef} className={classNameString} {...props} />
          <span className={styles["textarea-label__text"]}>{label}</span>
        </label>
      ) : (
        <textarea ref={textAreaRef} className={classNameString} {...props} />
      )}
    </div>
  );
};

export default TextArea;
