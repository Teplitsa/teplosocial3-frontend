import {
  ReactElement,
  useEffect,
  useContext,
  useRef,
  useState,
  MouseEvent,
} from "react";
import { useRouter } from "next/router";
import * as _ from "lodash";
import { useStoreActions, useStoreState } from "../../../model/helpers/hooks";

import { IBlockState } from "../../../model/model.typing";

import InclusiveComponents from "../../../inclusive-components/inclusive-components";
import Loader from "../../Loader";
import Quiz from "../quiz/Quiz";
import Task from "../task/Task";
import * as modals from "../Modals";

import styles from "./BlockContent.module.scss";

const { Button, ModalContext } = InclusiveComponents;

const BlockActions: React.FunctionComponent<{
  block: IBlockState;
  setActionStartLoading;
  completeBlockDoneCallback;
}> = ({
  block,
  setActionStartLoading,
  completeBlockDoneCallback,
}): ReactElement => {
  const router = useRouter();
  const user = useStoreState((state) => state.session.user);
  const session = useStoreState((state) => state.session);
  const module = useStoreState((state) => state.components.blockPage.module);

  const completeBlock = useStoreActions(
    (actions) => actions.components.blockPage.block.completeBlockByUser
  );
  const completeBlockByGuest = useStoreActions(
    (actions) => actions.components.blockPage.block.completeBlockByGuest
  );

  const { dispatch: modalDispatch } = useContext(ModalContext);

  return (
    <>
      {(session.isLoggedIn || block.isAvailableForGuest) && !block.isCompleted && (
        <div className={styles.actions}>
          {!!block.nextBlockSlug && (
            <Button
              className="btn_secondary"
              aria-label={`Изучить блок ${block.title.rendered} позже`}
              onClick={() => {
                router.push(`/blocks/${block.nextBlockSlug}`);
              }}
            >
              Пройти потом
            </Button>
          )}
          {
            <Button
              className="btn_primary"
              aria-label={`Завершить изучение блока ${block.title?.rendered}`}
              onClick={() => {
                setActionStartLoading(true);
                if (session.isLoggedIn) {
                  completeBlock({
                    block,
                    user,
                    doneCallback: completeBlockDoneCallback,
                  });
                } else {
                  completeBlockByGuest({
                    block,
                    module,
                    doneCallback: completeBlockDoneCallback,
                  });
                }
              }}
            >
              Продолжить
            </Button>
          }
        </div>
      )}

      {(!(session.isLoggedIn || block.isAvailableForGuest) ||
        block.isCompleted) && (
        <div className={styles.actions}>
          {!!block.nextBlockSlug && (
            <Button
              className="btn_secondary"
              aria-label={`Перейти к следующему блоку`}
              onClick={() => {
                modals.registerToContinueModal({
                  modalDispatch,
                  router,
                  onClose: null,
                });
              }}
            >
              Дальше
            </Button>
          )}

          {!block.nextBlockSlug && !!block.courseSlug && (
            <Button
              className="btn_secondary"
              aria-label={
                !session.isLoggedIn
                  ? `Перейти на окно регистрации`
                  : `Вернуться к программе курса`
              }
              onClick={() => {
                if (!session.isLoggedIn) {
                  router.push(`/auth/registration`);
                } else {
                  router.push(`/courses/${block.courseSlug}`);
                }
              }}
            >
              Дальше
            </Button>
          )}

          {!block.nextBlockSlug && !block.courseSlug && (
            <Button
              className="btn_secondary"
              aria-label={`Вернуться к программе трека`}
              onClick={() => {
                router.push(`/tracks/${block.trackSlug}`);
              }}
            >
              Дальше
            </Button>
          )}
        </div>
      )}
    </>
  );
};

export default BlockActions;
