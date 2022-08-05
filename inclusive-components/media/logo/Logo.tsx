import { ReactElement } from "react";
import LogoImage from "./img/logo_157x79.svg";
import { ILogoProps } from "../../inclusive-components.typing";
import styles from "./Logo.module.scss";

const Logo: React.FunctionComponent<ILogoProps> = ({
  children,
  className,
  align = "left",
  ...props
}): ReactElement => {
  const classNameString = [
    styles["logo"],
    styles[`logo_align-${align}`],
    ...(className
      ?.split(" ")
      .map((className) => styles[className] ?? className) ?? []),
  ].join(" ");

  return (
    <img
      alt="Логотип Теплица.Курсы"
      {...props}
      className={classNameString}
      src={LogoImage}
      width={157}
      height={79}
    />
  );
};

export default Logo;
