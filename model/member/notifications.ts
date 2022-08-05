import { action, thunk } from "easy-peasy";
import {
  INotificationsModel,
  INotificationsState,
  INotificationsActions,
  INotificationsThunks,
  IStoreModel,
  INotification,
  INotificationsWebSocketMessage,
} from "../model.typing";

const notificationsState: INotificationsState = {
  list: null,
};

const notificationsActions: INotificationsActions = {
  initializeState: action((prevState) => {
    Object.assign(prevState, notificationsState);
  }),
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState);
  }),
  setNotificationList: action((prevState, notificationList) => {
    prevState.list = notificationList;
  }),
  addNotificationItem: action((prevState, notificationItem) => {
    prevState.list = [notificationItem, ...(prevState.list ?? [])];
  }),
  updateNotificationItem: action(
    (prevState, { _id: updatedItemId, ...notificationItem }) => {
      const itemIndex = prevState.list.findIndex(
        ({ _id }) => _id === updatedItemId
      );

      prevState.list[itemIndex] = {
        ...prevState.list[itemIndex],
        ...notificationItem,
      };
    }
  ),
};

const notificationsThunks: INotificationsThunks = {
  notificationListRequest: thunk(
    (
      { setNotificationList, addNotificationItem, updateNotificationItem },
      wsRef,
      { getStoreState }
    ) => {
      const {
        session: {
          token: { authToken },
        },
      } = getStoreState() as IStoreModel;

      try {
        const requestUrl = new URL(process.env.NotificationMicroserviceUrl);

        const requestUrlArgs = {
          auth_token: authToken,
        };

        requestUrl.search = new URLSearchParams(requestUrlArgs).toString();

        const socket = new WebSocket(requestUrl.toString());

        wsRef.current = socket;

        // socket.onopen = () => {};

        socket.onmessage = ({ data }: MessageEvent<string>) => {
          const message = JSON.parse(data) as INotificationsWebSocketMessage;

          switch (message.operation) {
            case "get":
              setNotificationList(message.target as Array<INotification>);
              break;
            case "insert":
              addNotificationItem(message.target as INotification);
              break;
            case "update":
              updateNotificationItem(message.target as INotification);
              break;
          }
        };
      } catch (error) {
        console.error(error);
      }
    }
  ),
  notificationItemChangeRequest: thunk(
    async ({ updateNotificationItem }, { _id, status }, { getStoreState }) => {
      const {
        session: {
          user: { id: userId },
          token: { authToken },
        },
      } = getStoreState() as IStoreModel;

      try {
        const requestUrl = new URL(
          `${process.env.NotificationRestfulServiceUrl}/${_id}`
        );

        const response = await fetch(requestUrl.toString(), {
          method: "put",
          mode: "cors",
          headers: {
            "X-Auth-Token": String(authToken),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status, userId }),
        });

        if (response.status > 204) {
          throw new Error(`Bad response status has gotten: ${response.status}`);
        }
      } catch (error) {
        console.error(
          `An error occured when trying to connect the notification microservice: ${error}`
        );
      }
    }
  ),
};

const notificationsModel: INotificationsModel = {
  ...notificationsState,
  ...notificationsActions,
  ...notificationsThunks,
};

export default notificationsModel;
