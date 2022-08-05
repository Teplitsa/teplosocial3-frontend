import { ReactElement, useState } from "react";
import * as _ from "lodash";
import { useStoreActions, useStoreState } from "../../../model/helpers/hooks";

import {
  IBlockState,
} from "../../../model/model.typing";
import * as utils from "../../../utilities/utilities";
import Loader from "../../Loader";
import InclusiveComponents from "../../../inclusive-components/inclusive-components";
import TaskActions from "./TaskActions";
import FieldFile from "./fieldType/FieldFile";
import FieldText from "./fieldType/FieldText";
import FieldUrl from "./fieldType/FieldUrl";

import styles from './TaskForm.module.scss';

const TaskForm: React.FunctionComponent<{block: IBlockState}> = ({block}): ReactElement => {
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  return (
    <div className={styles.answerWrapper}>
      <div className={styles.answer}>
        <h5>Отправить задание:</h5>

        {isFormSubmitting && <div className={styles.actionsLoader}><Loader /></div>}

        {!isFormSubmitting &&
        <>
          <div className={styles.fields}>
              {_.includes(block.taskAvailableFields, "url") &&
                <FieldUrl block={block} />
              }
              {_.includes(block.taskAvailableFields, "text") &&
                <FieldText block={block} />
              }
              {_.includes(block.taskAvailableFields, "file") &&
                <FieldFile block={block} />
              }
          </div>

          <TaskActions block={block} setIsFormSubmitting={setIsFormSubmitting} />
        </>
        }
      </div>
    </div>
  );

};

export default TaskForm;
