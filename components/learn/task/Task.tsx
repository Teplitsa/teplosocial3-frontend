import { ReactElement, useEffect, useContext, useRef, useState, MouseEvent } from "react";
import { useRouter } from "next/router";
import * as _ from "lodash";
import { useStoreActions, useStoreState } from "../../../model/helpers/hooks";

import {
  IBlockState, IQuizState,
} from "../../../model/model.typing";
import TaskForm from "./TaskForm";
import Loader from "../../Loader";


import styles from './Task.module.scss';
import stylesBlock from '../block/BlockContent.module.scss'

const Task: React.FunctionComponent = (): ReactElement => {
  const [actionStartLoading, setActionStartLoading] = useState(false);
  const block = useStoreState(state => state.components.blockPage.block);

  return (
    <>
      <div className={styles.block}>

        {actionStartLoading && <div className={styles.actionsLoader}><Loader /></div>}

        {!actionStartLoading && block.isCompleted &&
          <>
            {/*
            {answersToBeGradedCount > 0 && wrongAnswersCount > 0 &&
              <h5>Вы допустили несколько ошибок в тесте. Ваши выполненные задания отправлены на проверку.</h5>
            }
            {answersToBeGradedCount > 0 && wrongAnswersCount === 0 &&
              <h5>Вы успешно завершили тест. Ваши выполненные задания отправлены на проверку.</h5>
            }
            {(answersToBeGradedCount === 0 && isQuizPassed || block.isCompleted) &&
              <h5>Вы успешно прошли тест!</h5>
            }
            {(answersToBeGradedCount === 0 && !isQuizPassed) && !block.isCompleted &&
              <h5>Вы допустили слишком много ошибок в тесте. Попытайтесь еще раз.</h5>
            }
            */}
          </>
        }

        {!actionStartLoading && !block.isCompleted &&
          <TaskForm block={block} />
        }

      </div>
      
    </>
  );
};

export default Task;
