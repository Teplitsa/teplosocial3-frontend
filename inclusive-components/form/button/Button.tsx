import { ReactElement, forwardRef } from "react";
import { IButtonProps } from "../../inclusive-components.typing";
import styles from "./Button.module.scss";

const Button = forwardRef<HTMLButtonElement, IButtonProps>(
  ({ children, className, type, ...props }, ref): ReactElement => {
    const classNameString = [
      styles["btn"],
      ...(className
        ?.split(" ")
        .map((className) => styles[className] ?? className) ?? []),
    ].join(" ");

    return (
      <button
        className={classNameString}
        type={type ?? "button"}
        {...props}
        ref={ref}
      >
        {children}
      </button>
    );
  }
);

export default Button;
