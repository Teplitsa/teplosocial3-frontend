import InclusiveComponents from "../../inclusive-components/inclusive-components";

const { Snackbar, Modal } = InclusiveComponents;

const withGlobalComponents = (
  WrappedComponent: React.FunctionComponent
): React.FunctionComponent => {
  return (props) => (
    <Snackbar>
      <Modal>
        <WrappedComponent {...props} />
      </Modal>
    </Snackbar>
  );
};

export default withGlobalComponents;
