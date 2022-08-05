import InclusiveComponents from "../../inclusive-components/inclusive-components";

import stylesModal from './Modals.module.scss';

const {
  Button,
} = InclusiveComponents;

export function registerToContinueModal({modalDispatch, router, onClose}) {
  modalDispatch({
    type: "template",
    payload: {
      size: "lg",
      type: "danger",
      layoutType: "alignLeft",
      title: "Чтобы перейти ĸ остальным материалам ĸурса, необходимо зарегистрироваться",
      onClose,
      content: ({ closeModal }) => (
        <>
          <p className={stylesModal.modalTextSlim}>
            А ещё вы сможете выполнить итоговое задание и получить сертифиĸат. Это бесплатно.
          </p>
          <div className={stylesModal.modalActionsSmallGap}>
            <Button className="btn_default" onClick={() => {
              closeModal({mustSkipOnClose: true});
            }}>
              Назад
            </Button>
            <Button className="btn_primary" onClick={() => {
              closeModal({mustSkipOnClose: true});
              router.push("/auth/registration");
            }}>
              Зарегистрироваться
            </Button>
          </div>
        </>
      ),
    },
  });
  modalDispatch({ type: "open" });      
}

export function registerToAccessTaskModal({modalDispatch, router, onClose}) {
  modalDispatch({
    type: "template",
    payload: {
      size: "lg",
      type: "danger",
      layoutType: "alignLeft",
      title: "Это итоговое задание курса, чтобы его открыть надо зарегистрироваться",
      onClose,
      content: ({ closeModal }) => (
        <>
          <p className={stylesModal.modalTextSlim}>
            После прохождения курса и выполнения итогового задания, вы получите именной сертификат.
          </p>
          <div className={stylesModal.modalActionsSmallGap}>
            <Button className="btn_default" onClick={() => {
              closeModal({mustSkipOnClose: true});
            }}>
              Назад
            </Button>
            <Button className="btn_primary" onClick={() => {
              closeModal({mustSkipOnClose: true});
              router.push("/auth/registration");
            }}>
              Зарегистрироваться
            </Button>
          </div>
        </>
      ),
    },
  });
  modalDispatch({ type: "open" });      
}

export function registerToAccessAdaptestModal({modalDispatch, router, onClose}) {
  modalDispatch({
    type: "template",
    payload: {
      size: "lg",
      type: "danger",
      layoutType: "alignLeft",
      title: "Это адаптационный тест курса, чтобы его пройти надо зарегистрироваться",
      onClose,
      content: ({ closeModal }) => (
        <>
          <p className={stylesModal.modalTextSlim}>
            После прохождения адаптационного теста мы зачтём модули, которые вы уже знаете.
          </p>
          <div className={stylesModal.modalActionsCenter}>
            <Button className="btn_primary" onClick={() => {
              closeModal({mustSkipOnClose: true});
              router.push("/auth/registration");
            }}>
              Зарегистрироваться
            </Button>
          </div>
        </>
      ),
    },
  });
  modalDispatch({ type: "open" });      
}
