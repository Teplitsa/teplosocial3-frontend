import {
  ReactElement,
  useState,
  useEffect,
  MouseEvent,
  FormEvent,
  forwardRef,
  MutableRefObject,
  useRef,
} from "react";
import Button from "../button/Button";
import { IInputTextProps } from "../../inclusive-components.typing";
import { convertObjectToClassName } from "../../../utilities/utilities";
import styles from "../input-text/InputText.module.scss";
import passwordStyles from "./InputPassword.module.scss";

const InputPassword: React.FunctionComponent<IInputTextProps> = forwardRef(
  (
    { label, className, ...props },
    inputRef: MutableRefObject<HTMLInputElement>
  ): ReactElement => {
    const classNameString = [
      styles["input"],
      styles["input_text"],
      className
        ?.split(" ")
        .map((className) => passwordStyles[className] ?? className) ?? [],
    ].join(" ");

    const [isEdited, setIsEdited] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [isPasswordHidden, setIsPasswordHidden] = useState(true);

    if (Object.is(null, inputRef)) {
      inputRef = useRef<HTMLInputElement>(null);
    }

    const handleTogglePasswordVisibility = (event: MouseEvent<HTMLElement>) =>
      setIsPasswordHidden((isPasswordHidden) => !isPasswordHidden);

    const handleErrorShow = (event: FormEvent<HTMLInputElement>) => {
      setHasError(true);
    };

    const handleErrorToggleFactory =
      (originalEvent?: (event: FormEvent<HTMLInputElement>) => void) =>
      (event: FormEvent<HTMLInputElement>) => {
        originalEvent && originalEvent(event);

        setHasError(!event.currentTarget.validity.valid);
      };

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
      const isValid = inputRef?.current.checkValidity();

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
              {...props}
              type={isPasswordHidden ? "password" : "text"}
              onChange={handleErrorToggleFactory(props.onChange)}
              onInvalid={handleErrorShow}
            />
            <span className={styles["input-label__text"]}>{label}</span>
          </label>
        ) : (
          <input
            ref={inputRef}
            className={classNameString}
            {...props}
            type={isPasswordHidden ? "password" : "text"}
            onChange={handleErrorToggleFactory(props.onChange)}
            onInvalid={handleErrorShow}
          />
        )}
        <Button
          className={convertObjectToClassName({
            btn_reset: true,
            [passwordStyles["input-btn"]]: true,
            [passwordStyles["input-btn_password-shown"]]: !isPasswordHidden,
            [passwordStyles["input-btn_has-error"]]: isEdited && hasError,
          })}
          disabled={props["disabled"] ?? false}
          aria-label={isPasswordHidden ? "Показать пароль" : "Скрыть пароль"}
          onClick={handleTogglePasswordVisibility}
        />
      </div>
    );
  }
);

export default InputPassword;
