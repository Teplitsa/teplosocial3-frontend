import { ReactElement, useEffect, useContext, useRef, useState, MouseEvent } from "react";
import { useRouter } from "next/router";
import * as _ from "lodash";
import { useStoreActions, useStoreState } from "../../../model/helpers/hooks";

import {
  IBlockState,
} from "../../../model/model.typing";

import InclusiveComponents from "../../../inclusive-components/inclusive-components";
import Loader from "../../Loader";
import Quiz from "../quiz/Quiz";
import Task from "../task/Task";

import styles from './BlockContent.module.scss'

const {
  Button,
  ModalContext,
} = InclusiveComponents;

const AdaptestIntoActions: React.FunctionComponent<{
  block: IBlockState,
  setActionStartLoading,
  completeBlockDoneCallback,
}> = ({
  block,
  setActionStartLoading,
  completeBlockDoneCallback,
}): ReactElement => {
  const router = useRouter();
  const user = useStoreState(state => state.session.user);
  const session = useStoreState(state => state.session);
  
  const startCourseByUser = useStoreActions(
    (actions) => actions.components.coursePage.course.startCourseByUser
  );
  const course = useStoreState(state => state.components.blockPage.course);

  const { dispatch: modalDispatch } = useContext(ModalContext);

  return (
    <>
      {session.isLoggedIn && !block.isCompleted &&
      <div className={styles.actions}>
        {!!block.nextBlockSlug &&
          <Button
            className="btn_secondary"
            aria-label={`Пропустить адаптационный тест курса «${block.title.rendered}»`}
            onClick={() => {
              startCourseByUser({
                course,
                user,
                doneCallback: () => {
                  router.push(`/blocks/${course.nextBlockSlug}`);
                },
              });
            }}
          >
            Пропустить
          </Button>
        }
        {
          <Button
            className="btn_primary"
            aria-label={`Пройти адаптационный тест курса «${block.title.rendered}»`}
            onClick={() => {
              router.push(`/adaptest/${course.adaptestSlug}`);              
            }}
          >
            Пройти тест
          </Button>
        }
      </div>      
      }

    </>
  );

};

export default AdaptestIntoActions;
