import { useReducer, createContext, ReactElement } from "react";
import { ISnackbarState } from "../inclusive-components.typing";

const snackbarInitialState: ISnackbarState = {
  messages: [],
};

const snackbarReducer = (
  state: ISnackbarState,
  action: { type: string; payload: ISnackbarState }
): ISnackbarState => {
  switch (action.type) {
    case "add":
      return {
        ...state,
        messages: state.messages.concat(
          action.payload.messages.filter(
            (message) =>
              !state.messages.some(
                (storedMessage) =>
                  storedMessage.text.trim().toLocaleLowerCase() ===
                  message.text.trim().toLocaleLowerCase()
              )
          )
        ),
      };
    case "delete":
      return {
        ...state,
        messages: state.messages.filter(
          (storedMessage) =>
            !action.payload.messages.some(
              (message) =>
                storedMessage.text.trim().toLocaleLowerCase() ===
                message.text?.trim().toLocaleLowerCase()
            )
        ),
      };
    case "clear":
      return {
        ...state,
        messages: [],
      };
    default:
      throw new Error(
        `Неизвестное действие '${action.type}' модуля  Snackbar.`
      );
  }
};

export const SnackbarContext = createContext(snackbarInitialState);

SnackbarContext.displayName = "snackbarContext";

const Snackbar: React.FunctionComponent = ({ children }): ReactElement => {
  const [snackbarState, snackbarDispatch] = useReducer(
    snackbarReducer,
    snackbarInitialState
  );

  return (
    <SnackbarContext.Provider
      value={Object.assign(snackbarState, {
        dispatch: snackbarDispatch,
      })}
    >
      {children}
    </SnackbarContext.Provider>
  );
};

export default Snackbar;
