import { ReactElement, useEffect, useContext, useRef, useState, MouseEvent } from "react";
import { useRouter } from "next/router";
import * as _ from "lodash";

import {
  IBlockState,
} from "../../../model/model.typing";
import { useStoreActions, useStoreState } from "../../../model/helpers/hooks";

import InclusiveComponents from "../../../inclusive-components/inclusive-components";

import styles from './TaskActions.module.scss';

const {
  Button,
} = InclusiveComponents;

const TaskActions: React.FunctionComponent<{
  block: IBlockState,
  setIsFormSubmitting,
}> = ({
  block,
  setIsFormSubmitting,
}): ReactElement => {
  const router = useRouter();
  const user = useStoreState(state => state.session.user);
  const session = useStoreState(state => state.session);
  const taskDataFields = useStoreState(state => state.components.blockPage.block.taskDataFields);
  const setTaskDataField = useStoreActions(actions => actions.components.blockPage.block.setTaskDataField);
  const module = useStoreState(state => state.components.blockPage.module);
  const uploadUserAssignmentRequest = useStoreActions(actions => actions.components.blockPage.block.uploadUserAssignmentRequest);
  const setIsTaskUploaded = useStoreActions(actions => actions.components.blockPage.block.setIsTaskUploaded);

  if(!session.isLoggedIn) {
    return null;
  }

  return (
    <div className={styles.actions}>
      {true &&
      <Button
        className="btn_primary"
        aria-label={`Отправить задание`}
        onClick={() => {
          if(_.isEmpty(taskDataFields)) {
            return;
          }

          setIsFormSubmitting(true);
          uploadUserAssignmentRequest({
            block, 
            module, 
            ...taskDataFields.file ? {file: taskDataFields.file as File} : {},
            ...taskDataFields.url ? {url: taskDataFields.url as string} : {},
            ...taskDataFields.text ? {text: taskDataFields.text as string} : {},
            doneCallback: handleAssignmentUpload, 
          });
        }}
      >
        Отправить
      </Button>
      }
    </div>
  );

  function handleAssignmentUpload(params) {
    // console.log("assignment uploaded:", params);
    setIsTaskUploaded(true);
    setIsFormSubmitting(false);
  }
};

export default TaskActions;
