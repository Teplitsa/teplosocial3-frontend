import {
  ImgHTMLAttributes,
  TextareaHTMLAttributes,
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  SelectHTMLAttributes,
  OptionHTMLAttributes,
  HTMLAttributes,
  Dispatch,
  MutableRefObject,
  FunctionComponent,
  SetStateAction,
} from "react";

export interface IClassNameObject {
  [className: string]: boolean;
}

export interface IInclusiveComponentProps {
  label?: string;
}
export interface IRangeProps {
  valueMin?: number;
  valueMax?: number;
  valueNow?: number;
  valueText?: string;
}

export interface IProgressBarProps
  extends IRangeProps,
    IInclusiveComponentProps {
  visibleText?: string;
  footerAlign?: "left" | "right" | "center" | "space-between";
  disabled?: boolean;
}

export interface IAccordionProps {
  theme?: "default" | "arrow-control";
  initIndex?: number;
}

export interface IInputTextProps
  extends IInclusiveComponentProps,
    InputHTMLAttributes<HTMLInputElement> {
  wrapperClassName?: string;
}

export interface IInputPasswordGroupProps
  extends HTMLAttributes<HTMLDivElement> {}

export interface ISnackbarMessage {
  context: "success" | "error";
  title?: string;
  text: string;
}

export interface ISnackbarState {
  messages: Array<ISnackbarMessage>;
  dispatch?: Dispatch<{
    type: string;
    payload?: ISnackbarState;
  }>;
}

export interface IModalState {
  isTransparent?: boolean;
  backdrop?: "dark" | "medium" | "light";
  invisibleTitle?: boolean;
  isShown?: boolean;
  size?: "auto" | "fullscreen" | "lg" | "md" | "sm" | "xs";
  type?: "primary" | "danger" | "warning";
  layoutType?: "noCover" | "cover" | "alignLeft";
  cover?: string;
  onClose?: (params?: any) => void;
  title?: string;
  content?: React.FunctionComponent<{ closeModal: (params?: any) => void }>;
  dispatch?: Dispatch<{
    type: string;
    payload?: IModalState;
  }>;
}

export interface IModalProps {
  siteContainerRef: MutableRefObject<HTMLElement>;
}

export interface ILogoProps extends ImgHTMLAttributes<HTMLImageElement> {
  align?: "left" | "center" | "right";
}

export interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export interface IInputCheckboxProps
  extends IInclusiveComponentProps,
    InputHTMLAttributes<HTMLInputElement> {}

export interface ITextAreaProps
  extends IInclusiveComponentProps,
    TextareaHTMLAttributes<HTMLTextAreaElement> {}

export interface ISelectProps
  extends IInclusiveComponentProps,
    SelectHTMLAttributes<HTMLSelectElement> {
  children?: Array<OptionHTMLAttributes<HTMLOptionElement>>;
  onQuasiOptionSelect?: (option: HTMLOptionElement) => void;
}

export interface ITooltipProps {
  content: FunctionComponent;
}

export interface ICarouselProps {
  topContent?: FunctionComponent;
  autoplay?: boolean;
  pauseOnHover?: boolean;
  animation?: {
    time: number;
    pauseTime: number;
  };
  itemWidth?: number;
  classNameObject?: {
    viewport?: IClassNameObject;
    controls?: IClassNameObject;
    nav?: IClassNameObject;
  };
  nav?: boolean;
  controls?: boolean;
}

export interface IMatrixTerm {
  order?: number;
  text: string;
}

export interface IMatrixDefinition {
  order?: number;
  text: string;
  slug: string;
  activeSlug?: string;
  initialized?: boolean;
  setSlugs?: Dispatch<SetStateAction<Array<string>>>;
  setActiveSlug?: Dispatch<SetStateAction<string>>;
}

export interface IMatrixProps {
  terms: Array<IMatrixTerm>;
  definitions: Array<IMatrixDefinition>;
  callbackFn?: (slugs: Array<string>) => void;
}
