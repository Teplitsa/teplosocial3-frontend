import { ReactElement } from "react";
import * as _ from "lodash";
import { useStoreActions, useStoreState } from "../../../../model/helpers/hooks";

import {
  IBlockState,
} from "../../../../model/model.typing";
import InclusiveComponents from "../../../../inclusive-components/inclusive-components";

import styles from './Field.module.scss';

const {
  TextArea,
} = InclusiveComponents;

const FieldText: React.FunctionComponent<{block: IBlockState}> = ({block}): ReactElement => {

  const taskDataFields = useStoreState(state => state.components.blockPage.block.taskDataFields);
  const setTaskDataField = useStoreActions(actions => actions.components.blockPage.block.setTaskDataField);

  return (
    <div className={styles.field}>
      <TextArea
        key={`Task${block.id}FieldText`}
        // label={`Напиши ответ`}
        name={`task_text_${block.id}`}
        placeholder={"Напиши ответ"}
        value={_.get(taskDataFields, "text", "")}
        onChange={(event) => {
          setTaskDataField({text: event.target.value});
        }}
      />
    </div>
  );
};

export default FieldText;
