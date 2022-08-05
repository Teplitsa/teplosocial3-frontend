import { useReducer, createContext, ReactElement } from "react";
import { IModalState } from "../inclusive-components.typing";

const modalInitialState: IModalState = {
  isTransparent: false,
  backdrop: "light",
  invisibleTitle: false,
  isShown: false,
  size: "md",
  title: "",
  content: null,
  type: "primary",
  layoutType: "noCover",
  cover: "",
  onClose: null,
};

const modalReducer = (
  state: IModalState,
  action: { type: string; payload: IModalState }
): IModalState => {
  switch (action.type) {
    case "open":
      return { ...state, isShown: true };
    case "close":
      return {
        ...state,
        isTransparent: false,
        backdrop: "light",
        invisibleTitle: false,
        isShown: false,
        size: "md",
        type: "primary",
        title: "",
        content: null,
      };
    case "template":
      return {
        ...state,
        isTransparent: action.payload.isTransparent ?? false,
        backdrop: action.payload.backdrop ?? "light",
        invisibleTitle: action.payload.invisibleTitle ?? false,
        size: action.payload.size ?? "md",
        type: action.payload.type ?? "primary",
        layoutType: action.payload.layoutType ?? "noCover",
        cover: action.payload.cover ?? "",
        title: action.payload.title,
        content: action.payload.content,
        onClose: action.payload.onClose,
      };
    default:
      throw new Error(`Неизвестное действие '${action.type}' модуля Modal.`);
  }
};

export const ModalContext = createContext(modalInitialState);

ModalContext.displayName = "modalContext";

const Modal: React.FunctionComponent = ({ children }): ReactElement => {
  const [modalState, modalDispatch] = useReducer(
    modalReducer,
    modalInitialState
  );

  return (
    <ModalContext.Provider
      value={Object.assign(modalState, {
        dispatch: modalDispatch,
      })}
    >
      {children}
    </ModalContext.Provider>
  );
};

export default Modal;
