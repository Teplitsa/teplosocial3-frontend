import { ReactElement } from "react";
import * as _ from "lodash";
import { useStoreActions, useStoreState } from "../../../../model/helpers/hooks";

import {
  IBlockState,
} from "../../../../model/model.typing";
import InclusiveComponents from "../../../../inclusive-components/inclusive-components";

import styles from './Field.module.scss';

const {
  InputText,
} = InclusiveComponents;

const FieldUrl: React.FunctionComponent<{block: IBlockState}> = ({block}): ReactElement => {

  const taskDataFields = useStoreState(state => state.components.blockPage.block.taskDataFields);
  const setTaskDataField = useStoreActions(actions => actions.components.blockPage.block.setTaskDataField);

  return (
    <div className={styles.field}>
      <InputText
        key={`Task${block.id}FieldUrl`}
        // label={`Прикрепи ссылку на задание`}
        name={`task_url_${block.id}`}
        placeholder={"Прикрепи ссылку на задание"}
        value={_.get(taskDataFields, "url", "")}
        onChange={(event) => {
          setTaskDataField({url: event.target.value});
        }}
      />
    </div>
  );
};

export default FieldUrl;
