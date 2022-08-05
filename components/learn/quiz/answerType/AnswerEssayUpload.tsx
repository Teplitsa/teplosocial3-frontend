import { ReactElement, useState } from "react";
import * as _ from "lodash";
import { useStoreActions, useStoreState } from "../../../../model/helpers/hooks";

import * as utils from "../../../../utilities/utilities";
import QuizActions from "../QuizActions";
import Loader from "../../../Loader";
import InclusiveComponents from "../../../../inclusive-components/inclusive-components";

import styles from './AnswerEssay.module.scss';

const {
  InputFile,
} = InclusiveComponents;

const AnswerEssayUpload: React.FunctionComponent = (): ReactElement => {
  const question = useStoreState(state => state.components.blockPage.quiz.activeQuestion);
  const module = useStoreState(state => state.components.blockPage.module);
  const setUserAnswer = useStoreActions(actions => actions.components.blockPage.quiz.setUserAnswer);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState(null);

  return (
    <div className={styles.answerWrapper}>
      <div className={styles.answer}>
        <h5>Отправить задание:</h5>

        {isFileUploading && <div className={styles.actionsLoader}><Loader /></div>}

        {!isFileUploading && question.answerData.map(answer => {
          return <InputFile
            key={`Question${question.id}Answer${answer.answer}`}
            label={answer.answer}
            name={`question_${question.id}`}
            placeholder={uploadedFileName ?? "Прикрепите файл"}
            onChange={(event) => {
              setIsFileUploading(true);
              handleFileChange(event);
            }}
          />       
        })}

        {/* <QuizActions /> */}
      </div>
    </div>
  );

  async function handleFileChange(e) {
    const file = e.target.files[0];

    setUploadedFileName(file.name);

    const form = new FormData();
    form.append("essayUpload", file, file.name);
    form.append("nonce", question.uploadNonce);
    form.append("question_id", String(question.id));
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
        setUserAnswer({questionId: question.id, answerValue: fileLink})
      }
    }

    setIsFileUploading(false);
  }  
};

export default AnswerEssayUpload;
