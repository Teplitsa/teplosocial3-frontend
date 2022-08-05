import { ReactElement, useState } from "react";
import * as _ from "lodash";
import { useStoreActions, useStoreState } from "../../../../model/helpers/hooks";

import {
  IBlockState,
} from "../../../../model/model.typing";
import * as utils from "../../../../utilities/utilities";
import TaskActions from "../TaskActions";
import Loader from "../../../Loader";
import InclusiveComponents from "../../../../inclusive-components/inclusive-components";

import styles from './Field.module.scss';

const {
  InputFile,
} = InclusiveComponents;

const FieldFile: React.FunctionComponent<{block: IBlockState}> = ({block}): ReactElement => {

  const taskDataFields = useStoreState(state => state.components.blockPage.block.taskDataFields);
  const setTaskDataField = useStoreActions(actions => actions.components.blockPage.block.setTaskDataField);

  const module = useStoreState(state => state.components.blockPage.module);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState(null);

  return (
    <div className={styles.field}>
      {isFileUploading && <div className={styles.actionsLoader}><Loader /></div>}

      {!isFileUploading && 
        <InputFile
          key={`Task${block.id}FieldFile`}
          // label={`Прикрепи файл`}
          name={`task_file_${block.id}`}
          placeholder={uploadedFileName ?? "Прикрепи файл"}
          onChange={(event) => {
            // setIsFileUploading(true);
            handleFileChange(event);
          }}
        />       
      }
    </div>
  );

  async function handleFileChange(e) {
    const file = e.target.files[0];

    setUploadedFileName(file.name);
    setTaskDataField({file: file});
    return;

    const form = new FormData();
    form.append("essayUpload", file, file.name);
    // form.append("nonce", question.uploadNonce);
    // form.append("question_id", String(question.id));
    form.append("course_id", String(module.id));

    // console.log("question.uploadNonce:", question.uploadNonce);

    const response = await utils.tokenFetch(utils.getAjaxUrl("learndash_upload_essay"), {
      method: "post",
      body: form,
    });

    if(response.ok) {
      const data = await response.json();

      const fileLink = _.get(data, "data.filelink");
      if(fileLink) {
        setTaskDataField({file: fileLink});
      }
    }

    setIsFileUploading(false);
  }  
};

export default FieldFile;
