import { ReactElement } from "react";

import styles from './BorderUnderHeader.module.scss';

const BorderUnderHeader: React.FunctionComponent = (): ReactElement => {
    return (
        <div className={styles.border} />
    )
}

export default BorderUnderHeader;