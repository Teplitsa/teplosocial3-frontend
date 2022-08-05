import {
  ReactElement,
  cloneElement,
  Children,
  FormEvent,
  useRef,
  useState,
  useEffect,
} from "react";
import InputPassword from "../input-password/InputPassword";
import { IInputPasswordGroupProps } from "../../inclusive-components.typing";
import passwordGroupStyles from "./InputPasswordGroup.module.scss";
import { escapeRegEx } from "../../../utilities/utilities";

const InputPasswordGroup: React.FunctionComponent<IInputPasswordGroupProps> = ({
  children,
  className,
  ...props
}): ReactElement => {
  const classNameString = [
    passwordGroupStyles["input-password-group"],
    className
      ?.split(" ")
      .map((className) => passwordGroupStyles[className] ?? className) ?? null,
  ].join(" ");

  const inputPasswordRef = useRef<HTMLInputElement>(null);
  const inputPasswordRepeatRef = useRef<HTMLInputElement>(null);
  const [passwordPattern, setPasswordPattern] = useState<string>(null);

  const handleInputPasswordChangeFactory =
    (originalEvent?: (event: FormEvent<HTMLInputElement>) => void) =>
    (event: FormEvent<HTMLInputElement>) => {
      originalEvent && originalEvent(event);

      setPasswordPattern(event.currentTarget.value);
    };

  useEffect(() => {
    passwordPattern &&
      inputPasswordRepeatRef.current.dispatchEvent(new Event("focus"));
  }, [passwordPattern]);

  if (Children.count(children) !== 2) {
    console.error("InputPasswordGroup must contain 2 child components.");

    return null;
  }

  if (
    Children.toArray(children).some(
      (childComponent: ReactElement) => childComponent.type !== InputPassword
    )
  ) {
    console.error("Child component must have 'InputPassword' type.");

    return null;
  }

  return (
    <div className={classNameString} {...props}>
      {Children.map(
        children,
        (inputPassword: ReactElement, inputPasswordIndex) => {
          if (inputPasswordIndex === 0) {
            return cloneElement(inputPassword, {
              ref: inputPasswordRef,
              onChange: handleInputPasswordChangeFactory(
                inputPassword.props.onChange
              ),
            });
          }

          if (inputPasswordIndex === 1) {
            return cloneElement(inputPassword, {
              ref: inputPasswordRepeatRef,
              pattern: escapeRegEx(passwordPattern),
            });
          }
        }
      )}
    </div>
  );
};

export default InputPasswordGroup;
