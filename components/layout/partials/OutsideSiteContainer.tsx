import { ReactElement, MutableRefObject } from "react";
import InclusiveComponents from "../../../inclusive-components/inclusive-components";

const { SnackbarList, ModalContainer } = InclusiveComponents;

const OutsideSiteContainer: React.FunctionComponent<{
  siteContainerRef: MutableRefObject<HTMLElement>;
}> = ({ siteContainerRef }): ReactElement => {
  return (
    <>
      <ModalContainer {...{ siteContainerRef }} />
      <SnackbarList />
    </>
  );
};

export default OutsideSiteContainer;
