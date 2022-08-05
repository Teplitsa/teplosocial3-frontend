import { useState, useRef, useContext, ReactElement } from "react";
import { SnackbarContext } from "./Snackbar";
import Button from "../form/button/Button";
import useIsomorphicLayoutEffect from "../../custom-hooks/use-isomorphic-layout-effect";
import { ISnackbarMessage } from "../inclusive-components.typing";
import { convertObjectToClassName } from "../../utilities/utilities";
import styles from "./Snackbar.module.scss";

const SnackbarListItem: React.FunctionComponent<{
  message: ISnackbarMessage;
}> = ({ message }): ReactElement => {
  const elementRef = useRef<HTMLElement>(null);
  const { dispatch } = useContext(SnackbarContext);
  const [isActive, setActivity] = useState<boolean>(false);

  const closeSnackbar = () => {
    setTimeout(
      () => dispatch({ type: "delete", payload: { messages: [message] } }),
      300
    );

    setActivity(false);

    elementRef.current?.focus();
  };

  useIsomorphicLayoutEffect(() => {
    const focusedElement = document.querySelector<HTMLElement>(":focus");
    const timerId = setTimeout(() => closeSnackbar(), 10000);

    setActivity(true);

    elementRef.current = focusedElement;

    return () => clearTimeout(timerId);
  }, []);

  return (
    <div
      className={convertObjectToClassName({
        [styles["snackbar-list__item"]]: true,
        [styles[`snackbar-list__item_${message.context}`]]: true,
        [styles["snackbar-list__item_active"]]: isActive,
      })}
    >
      <div className={styles["snackbar-list__item-inner"]}>
        {message.title && (
          <h6
            className={convertObjectToClassName({
              [styles["snackbar-list__item-title"]]: true,
              [styles[`snackbar-list__item-title_${message.context}`]]: true,
            })}
          >
            {message.title}
          </h6>
        )}
        <span
          className={convertObjectToClassName({
            [styles["snackbar-list__item-text"]]: true,
            [styles[`snackbar-list__item-text_${message.context}`]]: true,
          })}
        >
          <span className={styles["snackbar-list__item-context"]}>
            {message.context === "success" && "Поздравляем!"}
            {message.context === "error" && "Ошибка!"}
          </span>
          <span
            className={styles["snackbar-list__item-message"]}
            dangerouslySetInnerHTML={{ __html: message.text }}
          />
        </span>
        <Button
          className={convertObjectToClassName({
            btn_reset: true,
            [styles["snackbar-list__item-close"]]: true,
            [styles[`snackbar-list__item-close_${message.context}`]]: true,
          })}
          onClick={closeSnackbar}
          aria-label="Закрыть всплывающее сообщение"
        />
      </div>
    </div>
  );
};

export default SnackbarListItem;
