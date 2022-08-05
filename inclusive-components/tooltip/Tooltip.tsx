import {
  ReactElement,
  Children,
  cloneElement,
  TransitionEvent,
  useState,
  useEffect,
  useRef,
} from "react";
import Button from "../form/button/Button";
import useTouchable from "../../custom-hooks/use-touchable";
import { ITooltipProps } from "../inclusive-components.typing";
import { convertObjectToClassName } from "../../utilities/utilities";
import styles from "./Tooltip.module.scss";

const Tooltip: React.FunctionComponent<ITooltipProps> = ({
  children,
  content: TooltipContent,
}): ReactElement => {
  const isTouchable = useTouchable();
  const controlRef = useRef<HTMLButtonElement>(null);
  const [isShown, setIsShown] = useState<boolean>(false);
  const [isContentVisible, setIsContentVisible] = useState<boolean>(false);

  const handleTooltipContentTransitionEnd = (
    event: TransitionEvent<HTMLDivElement>
  ) => {
    !isShown && setIsContentVisible(false);
  };

  const handleControlBlur = (event: FocusEvent) => setIsShown(false);

  const handleControlMouseEnter = (event: MouseEvent) => setIsShown(true);

  const handleControlMouseLeave = (event: MouseEvent) => setIsShown(false);

  const handleControlTouchStart = (event: TouchEvent) => setIsShown(true);

  const handleControlTouchEnd = (event: TouchEvent) => setIsShown(false);

  const handleControlKeyDown = (event: KeyboardEvent) => {
    const { key } = event;

    if (key === "Escape") {
      setIsShown(false);
    } else if (key === "Enter") {
      setIsShown(true);
    }
  };

  const handleDocumentClick = (event: MouseEvent) => {
    event.target !== controlRef.current && setIsShown(false);
  };

  const controlEventListeners = isTouchable
    ? {
        onTouchStart: handleControlTouchStart,
        onTouchEnd: handleControlTouchEnd,
      }
    : {
        onMouseEnter: handleControlMouseEnter,
        onMouseLeave: handleControlMouseLeave,
        onBlur: handleControlBlur,
        onKeyDown: handleControlKeyDown,
      };

  useEffect(() => {
    document.addEventListener("click", handleDocumentClick, true);

    return () => document.removeEventListener("click", handleDocumentClick);
  }, [controlRef]);

  useEffect(() => isShown && setIsContentVisible(true), [isShown]);

  if (
    Children.count(children) !== 1 ||
    (children as ReactElement).type !== Button
  ) {
    console.error("Tooltip component must contain only one button element.");

    return null;
  }

  return (
    <div className={styles["tooltip-container"]}>
      {cloneElement(children as ReactElement, {
        ...(children as ReactElement).props,
        ...controlEventListeners,
        ref: controlRef,
      })}
      <div className={styles["tooltip__content-wrapper"]} role="status">
        <div
          className={convertObjectToClassName({
            [styles["tooltip__content"]]: true,
            [styles["tooltip__content_active"]]: isShown,
          })}
          onTransitionEnd={handleTooltipContentTransitionEnd}
        >
          {isContentVisible && <TooltipContent />}
        </div>
      </div>
    </div>
  );
};

export default Tooltip;
