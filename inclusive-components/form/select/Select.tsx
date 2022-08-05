import {
  ReactElement,
  useRef,
  useState,
  useEffect,
  createElement,
  MouseEvent,
  KeyboardEvent,
  FocusEvent,
} from "react";
import { ISelectProps } from "../../inclusive-components.typing";
import { convertObjectToClassName } from "../../../utilities/utilities";
import styles from "./Select.module.scss";

const Select: React.FunctionComponent<ISelectProps> = ({
  children,
  label,
  className,
  onQuasiOptionSelect,
  ...props
}): ReactElement => {
  const classNameString = [
    styles["quasi-select"],
    className?.split(" ").map((className) => styles[className] ?? className) ??
      [],
  ].join(" ");

  const selectRef = useRef<HTMLSelectElement>(null);
  const quasiSelectRef = useRef<HTMLDivElement>(null);
  const [isSelectFocused, setIsSelectFocused] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  useEffect(() => {
    if (!label && !props["aria-label"]) {
      console.error("Label or aria-label attribute must be specified.");
    }

    selectRef.current?.addEventListener("change", handleSelectChange);

    return () =>
      selectRef.current?.removeEventListener("change", handleSelectChange);
  }, []);

  const handleQuasiSelectItemClick = (
    event: MouseEvent<HTMLDivElement>
  ): void => {
    const selectedOptionValue = event.currentTarget.dataset.value;
    const selectedOption =
      Array.from(selectRef.current?.options).filter(
        (option) => option.value === selectedOptionValue
      )[0] ?? null;

    onQuasiOptionSelect && onQuasiOptionSelect(selectedOption);

    setIsExpanded((prevState) => !prevState);
    selectRef.current?.focus();
  };

  const handleQuasiSelectedClick = (
    event: MouseEvent<HTMLDivElement>
  ): void => {
    setIsExpanded((prevState) => !prevState);
    selectRef.current?.focus();
  };

  const handleSelectKeyDown = (
    event: KeyboardEvent<HTMLSelectElement>
  ): void => {
    const { altKey, ctrlKey, shiftKey, key } = event;

    switch (key) {
      case "Enter":
      case " ": // Space
        setIsExpanded(true);
        break;
      // case "ArrowUp":
      //   break;
      case "ArrowDown":
        altKey && setIsExpanded(true);
        break;
      // case "ArrowLeft":
      //   break;
      // case "ArrowRight":
      //   break;
      default:
        return;
    }
  };

  const handleSelectChange = (event: Event): void => setIsExpanded(false);

  const handleSelectFocus = (event: FocusEvent<HTMLSelectElement>): void =>
    setIsSelectFocused(true);

  const handleSelectBlur = (event: FocusEvent<HTMLSelectElement>): void =>
    setIsSelectFocused(false);

  return (
    <div
      className={convertObjectToClassName({
        [styles["quasi-select-wrapper"]]: true,
      })}
    >
      <select
        {...props}
        className={styles["select"]}
        aria-label={label ?? props["aria-label"] ?? null}
        onFocus={handleSelectFocus}
        onBlur={handleSelectBlur}
        onKeyDown={handleSelectKeyDown}
        ref={selectRef}
      >
        {children.map((optionProps, i) => {
          return createElement("option", {
            key: `SelectOption-${i}`,
            ...optionProps,
          });
        })}
      </select>
      <div
        className={convertObjectToClassName({
          [classNameString]: true,
          [styles["quasi-select_focused"]]: isSelectFocused,
          [styles["quasi-select_not-multiple"]]: !props.multiple,
        })}
        aria-hidden={true}
        ref={quasiSelectRef}
      >
        {!props.multiple && (
          <div
            className={convertObjectToClassName({
              [styles["quasi-select__selected"]]: true,
              [styles["quasi-select__selected_expanded"]]: isExpanded,
            })}
            onClick={handleQuasiSelectedClick}
          >
            {children.filter((option) => option.selected)[0]?.label ??
              label ??
              props["aria-label"] ??
              ""}
          </div>
        )}
        <div
          className={convertObjectToClassName({
            [styles["quasi-select__list"]]: true,
            [styles["quasi-select__list_expanded"]]:
              props.multiple || isExpanded,
            [styles["quasi-select__list_not-multiple"]]: !props.multiple,
          })}
        >
          {children.map((optionProps, i) => {
            return createElement(
              "div",
              {
                key: `QuasiSelectOption-${i}`,
                className: convertObjectToClassName({
                  [styles["quasi-select__item"]]: true,
                  [styles["quasi-select__item_active"]]: optionProps.selected,
                }),
                "data-value": optionProps.value,
                onClick: handleQuasiSelectItemClick,
              },
              optionProps.label ?? ""
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Select;
