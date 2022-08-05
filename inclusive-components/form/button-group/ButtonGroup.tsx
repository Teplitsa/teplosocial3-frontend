import { ReactElement, HTMLAttributes } from "react";
import styles from "./ButtonGroup.module.scss";

const Button: React.FunctionComponent<HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}): ReactElement => {
  const classNameString = [
    styles["btn-group"],
    ...(className
      ?.split(" ")
      .map((className) => styles[className] ?? className) ?? []),
  ].join(" ");

  return (
    <div className={classNameString} {...props}>
      {children}
    </div>
  );
};

export default Button;
