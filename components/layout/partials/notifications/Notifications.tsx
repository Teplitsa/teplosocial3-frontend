import {
  ReactElement,
  useEffect,
  useState,
  MouseEvent,
  KeyboardEvent,
  useRef,
  useMemo,
} from "react";
import { BSONType } from "mongodb";
import {
  useStoreState,
  useStoreActions,
} from "../../../../model/helpers/hooks";
import { convertObjectToClassName } from "../../../../utilities/utilities";
import InclusiveComponents from "../../../../inclusive-components/inclusive-components";
import { INotificationStatusNames } from "model/model.typing";

import styles from "./Notifications.module.scss";

const { Button } = InclusiveComponents;

const Notifications: React.FunctionComponent = (): ReactElement => {
  const wsRef = useRef<WebSocket>(null);
  const notificationListWrapperRef = useRef<HTMLDivElement>(null);
  const notifications = useStoreState(
    (state) => state.components.notifications.list
  );
  const notificationListRequest = useStoreActions(
    (actions) => actions.components.notifications.notificationListRequest
  );
  const notificationItemChangeRequest = useStoreActions(
    (actions) => actions.components.notifications.notificationItemChangeRequest
  );
  const [isNotificationListShown, setIsNotificationListShown] =
    useState<boolean>(false);
  const notificationCount = useMemo(
    () => notifications?.length ?? 0,
    [notifications]
  );
  const undeliveredNotificationCount = useMemo(
    () =>
      notifications?.reduce(
        (count, { status }) => (status === "created" ? count + 1 : count),
        0
      ) ?? 0,
    [notifications]
  );
  const unreadNotificationCount = useMemo(
    () =>
      notifications?.reduce(
        (count, { status }) => (status !== "read" ? count + 1 : count),
        0
      ) ?? 0,
    [notifications]
  );

  useEffect(() => {
    if (undeliveredNotificationCount === 0 || !isNotificationListShown) return;

    notifications
      .filter(({ status }) => status === "created")
      .map(({ _id }) => {
        notificationItemChangeRequest({ _id, status: "delivered" });
      });
  }, [
    undeliveredNotificationCount,
    isNotificationListShown,
    notifications,
    notificationItemChangeRequest,
  ]);

  useEffect(() => {
    if (isNotificationListShown) {
      notificationListWrapperRef.current.hidden = false;
    }
  }, [isNotificationListShown]);

  useEffect(
    () => () => {
      wsRef.current?.close();
    },
    [wsRef]
  );

  useEffect(() => {
    const wrapper = notificationListWrapperRef.current;
    const handleWrapperTransitionEnd = (event: TransitionEvent) => {
      if (event.propertyName !== "opacity") return;

      if ((event.target as HTMLElement).className.search(/_inactive/) !== -1) {
        wrapper.hidden = true;
      }
    };

    wrapper.addEventListener("transitionend", handleWrapperTransitionEnd);

    return () =>
      wrapper.removeEventListener("transitionend", handleWrapperTransitionEnd);
  }, []);

  useEffect(() => notificationListRequest(wsRef), []);

  const handleNotificationControlClick = (
    event: MouseEvent<HTMLButtonElement>
  ) => {
    setIsNotificationListShown((isShown) => !isShown);
  };

  const handleNotificationItemClickFactory =
    ({
      _id,
      status,
    }: {
      _id: BSONType | string;
      status: INotificationStatusNames;
    }) =>
    (event: MouseEvent<HTMLLIElement>) => {
      notificationItemChangeRequest({ _id, status });
    };

  const handleNotificationItemKeyDownFactory =
    ({
      _id,
      status,
    }: {
      _id: BSONType | string;
      status: INotificationStatusNames;
    }) =>
    (event: KeyboardEvent<HTMLLIElement>) => {
      if (event.key !== "Enter") return;

      notificationItemChangeRequest({ _id, status });
    };

  return (
    <div className={styles["notifications"]}>
      <Button
        className={convertObjectToClassName({
          btn_reset: true,
          [styles["notifications__control"]]: true,
          [styles["notifications__control_active"]]:
            unreadNotificationCount > 0,
        })}
        aria-haspopup="true"
        aria-controls="notification-list-wrapper"
        aria-expanded={isNotificationListShown}
        onClick={handleNotificationControlClick}
      >
        <span className={styles["notifications__control-caption"]}>
          {isNotificationListShown
            ? "Закрыть список уведомлени"
            : "Открыть список уведомлений"}
        </span>
      </Button>
      <div
        ref={notificationListWrapperRef}
        id="notification-list-wrapper"
        className={convertObjectToClassName({
          [styles["notifications__list-wrapper"]]: true,
          [styles["notifications__list-wrapper_inactive"]]:
            !isNotificationListShown,
        })}
        aria-labelledby="notifications-title"
      >
        {notificationCount > 0 && (
          <div
            id="notifications-title"
            className={styles["notifications__title"]}
          >
            Уведомления{" "}
            <span
              className={convertObjectToClassName({
                [styles["notifications__count"]]: true,
                [styles["notifications__count_unread"]]:
                  unreadNotificationCount > 0,
                [styles["notifications__count_read"]]:
                  unreadNotificationCount === 0,
              })}
            >
              {unreadNotificationCount > 0 && (
                <>
                  <span className={styles["notifications__count-caption"]}>
                    непрочитанных —{" "}
                  </span>
                  {unreadNotificationCount}/
                </>
              )}
            </span>
            <span className={styles["notifications__count"]}>
              <span className={styles["notifications__count-caption"]}>
                всего —{" "}
              </span>
              {notificationCount}
            </span>
          </div>
        )}
        {(notificationCount > 0 && (
          <ul className={styles["notifications__list"]}>
            {notifications
              .sort(
                ({ timestamp: prevTimestamp }, { timestamp: nextTimestamp }) =>
                  nextTimestamp - prevTimestamp
              )
              .map(({ _id, timestamp, status, text }) => (
                <li
                  key={`NotificationListItem-${_id}`}
                  className={convertObjectToClassName({
                    [styles["notifications__item"]]: true,
                    [styles["notifications__item_unread"]]: status !== "read",
                  })}
                  tabIndex={0}
                  onClick={handleNotificationItemClickFactory({
                    _id,
                    status: "read",
                  })}
                  onKeyDown={handleNotificationItemKeyDownFactory({
                    _id,
                    status: "read",
                  })}
                >
                  {status == "read" && (
                    <div className={styles["notifications__item-tip"]}>
                      Отметье как прочитанное с помощью клавиши Enter
                    </div>
                  )}
                  <div className={styles["notifications__item-tip"]}>
                    Текст сообщения:
                  </div>
                  <div
                    className={convertObjectToClassName({
                      [styles["notifications__item-text"]]: true,
                      [styles["notifications__item-text_unread"]]:
                        status !== "read",
                    })}
                    dangerouslySetInnerHTML={{ __html: text }}
                  />
                  <time
                    dateTime={new Date(timestamp).toISOString()}
                    className={styles["notifications__item-date"]}
                  >
                    {new Intl.DateTimeFormat("ru-RU", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    }).format(timestamp)}
                  </time>
                </li>
              ))}
          </ul>
        )) || (
          <div className={styles["notifications__empty-message"]}>
            У вас пока нет уведомлений
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
