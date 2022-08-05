import { useContext, ReactElement } from "react";
import { SnackbarContext } from "./Snackbar";
import SnackbarListItem from "./SnackbarListItem";
import { generateUniqueKey } from "../../utilities/utilities";
import styles from "./Snackbar.module.scss";

const SnackbarList: React.FunctionComponent = (): ReactElement => {
  const { messages } = useContext(SnackbarContext);

  return (
    <div
      className={`${styles["snackbar-list"]}`}
      aria-live="polite"
      aria-relevant="additions removals"
      aria-atomic="true"
    >
      {messages.map((message) => (
        <SnackbarListItem
          key={generateUniqueKey({
            base: message.text,
            prefix: "Snackbar",
          })}
          {...{ message }}
        />
      ))}
    </div>
  );
};

export default SnackbarList;
