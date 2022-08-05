import {
  ReactElement,
  useState,
  useEffect,
  useRef,
  useContext,
  MouseEvent,
  TransitionEvent,
} from "react";
import useIsomorphicLayoutEffect from "../../custom-hooks/use-isomorphic-layout-effect";
import { ModalContext } from "../modal/Modal";
import Button from "../form/button/Button";
import { IModalProps } from "../inclusive-components.typing";
import { convertObjectToClassName } from "../../utilities/utilities";
import styles from "./Modal.module.scss";

const ModalContainer: React.FunctionComponent<IModalProps> = ({
  siteContainerRef,
}): ReactElement => {
  const {
    isTransparent,
    backdrop,
    invisibleTitle,
    isShown,
    size,
    type,
    layoutType,
    cover,
    title,
    content: ModalContent,
    onClose,
    dispatch,
  } = useContext(ModalContext);
  const elementRef = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [isActive, setActivity] = useState<boolean>(false);

  const closeModal = (params: any = {}) => {
    setTimeout(() => {
      if (onClose) {
        onClose(params);
      }
      dispatch({ type: "close" });
      siteContainerRef.current?.removeAttribute("aria-hidden");
      elementRef.current?.focus();
    }, 300);
    setActivity(false);
  };

  const handleContainerClick = (event: MouseEvent<HTMLDivElement>): void => {
    (event.target as HTMLElement).classList.contains(styles.modal_active) &&
      closeModal();
  };

  const handleDialogTransitionEnd = (
    event: TransitionEvent<HTMLDivElement>
  ): void => {
    if (
      event.propertyName !== "visibility" ||
      event.elapsedTime !== 0.3 ||
      !isActive
    )
      return;

    siteContainerRef.current.setAttribute("aria-hidden", "true");
    event.currentTarget.focus();
  };

  const handleSiteContainerFocus = (event: Event) => {
    event.stopPropagation();

    dialogRef.current?.focus();
  };

  const handleDialogKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();

      closeModal();
    }
  };

  useEffect(() => {
    isShown && setActivity(true);
  }, [isShown]);

  useIsomorphicLayoutEffect(() => {
    if (!isShown) return;

    const focusedElement = document.querySelector<HTMLElement>(":focus");

    elementRef.current = focusedElement;

    siteContainerRef.current.addEventListener(
      "focus",
      handleSiteContainerFocus,
      true
    );

    dialogRef.current?.addEventListener("keydown", handleDialogKeydown);

    return () => {
      if (!siteContainerRef.current) {
        return;
      }

      siteContainerRef.current.removeEventListener(
        "focus",
        handleSiteContainerFocus
      );
    };
  }, [isShown]);

  if (!isShown) return null;

  return (
    <div
      className={convertObjectToClassName({
        [styles.modal]: true,
        [styles.modal_active]: isActive,
        [styles[`modal_backdrop-${backdrop}`]]: true,
      })}
      onClick={handleContainerClick}
    >
      <div
        ref={dialogRef}
        className={convertObjectToClassName({
          [styles.modal__dialog]: true,
          [styles[`modal__dialog_transparent`]]: Boolean(isTransparent),
          [styles[`modal__dialog_${type}`]]: true,
          [styles[`modal__dialog_${size}`]]: true,
          [styles[`modal__dialog_${layoutType}`]]: true,
          [styles.modal__dialog_active]: isActive,
        })}
        style={{
          ...cover ? {
            backgroundImage: cover,
          } : {}
        }}
        role="dialog"
        aria-labelledby={styles.modal__title}
        tabIndex={0}
        onTransitionEnd={handleDialogTransitionEnd}
      >
        <div className={styles.modal__content}>
          <div
            className={convertObjectToClassName({
              [styles.modal__header]: true,
              [styles["modal__header_invisible-title"]]:
                Boolean(invisibleTitle),
            })}
          >
            <h5
              id={styles.modal__title}
              className={convertObjectToClassName({
                [styles.modal__title]: true,
                [styles.modal__title_invisible]: Boolean(invisibleTitle),
              })}
            >
              {title}
            </h5>
            <Button
              className={convertObjectToClassName({
                btn_reset: true,
                [styles.modal__close]: true,
                [styles.modal__close_transparent]: Boolean(isTransparent),
              })}
              onClick={closeModal}
              aria-label="Закрыть модальное окно"
            />
          </div>
          <div className={styles.modal__body}>
            <ModalContent {...{ closeModal }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalContainer;
