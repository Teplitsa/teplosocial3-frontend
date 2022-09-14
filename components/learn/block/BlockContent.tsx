import {
  ReactElement,
  useEffect,
  useContext,
  useRef,
  useState,
  forwardRef,
} from "react";
import { useRouter } from "next/router";
import * as _ from "lodash";
import Link from "next/link";
import { useStoreActions, useStoreState } from "../../../model/helpers/hooks";

import { IBlockState } from "../../../model/model.typing";

import InclusiveComponents from "../../../inclusive-components/inclusive-components";
import { getRestApiUrl } from "../../../utilities/utilities";
import Loader from "../../Loader";
import Quiz from "../quiz/Quiz";
import Task from "../task/Task";
import BlockActions from "./BlockActions";
import RateCourse from "../course/review/RateCourse";
import CourseReviewForm from "../course/review/CourseReviewForm";
import AdaptestBanner from "../course/AdaptestBanner";
import AdaptestIntoActions from "./AdaptestIntoActions";
import * as modals from "../Modals";
import withShortcodes from "../../hoc/withShortcodes";

import styles from "./BlockContent.module.scss";
import stylesModal from "../Modals.module.scss";

import courseCompletedCover from "../../../assets/img/course-completed-modal-cover.svg";
import trackCompletedCover from "../../../assets/img/track-completed-modal-cover.svg";

const { Button, ModalContext } = InclusiveComponents;

const BlockContent: React.FunctionComponent<{ block: IBlockState }> = ({
  block,
}): ReactElement => {
  const BlockContent = withShortcodes({
    Content: forwardRef((props, ref) => (
      <template
        {...props}
        ref={ref}
        dangerouslySetInnerHTML={{ __html: block.content?.rendered }}
      />
    )),
  });
  const router = useRouter();
  const contentRef = useRef(null);
  const user = useStoreState((state) => state.session.user);
  const session = useStoreState((state) => state.session);

  const completeBlock = useStoreActions(
    (actions) => actions.components.blockPage.block.completeBlockByUser
  );
  const quiz = useStoreState((state) => state.components.blockPage.quiz);
  const course = useStoreState((state) => state.components.blockPage.course);
  const uploadedTask = useStoreState(
    (state) => state.components.blockPage.block.uploadedTask
  );
  const isTaskUploaded = useStoreState(
    (state) => state.components.blockPage.block.isTaskUploaded
  );
  const setIsTaskUploaded = useStoreActions(
    (actions) => actions.components.blockPage.block.setIsTaskUploaded
  );
  const setIsBlockCompletedByGuest = useStoreActions(
    (actions) => actions.components.blockPage.block.setIsBlockCompletedByGuest
  );

  const initPassingState = useStoreActions(
    (actions) => actions.components.blockPage.quiz.initPassingState
  );
  const setIsCompleted = useStoreActions(
    (actions) => actions.components.blockPage.block.setIsCompleted
  );

  const [actionStartLoading, setActionStartLoading] = useState(false);
  const { dispatch: modalDispatch } = useContext(ModalContext);
  const [mustDisplayQuiz, setMustDisplayQuiz] = useState(false);
  const [mustDisplayTask, setMustDisplayTask] = useState(false);

  // review
  const submitCourseReview = useStoreActions(
    (actions) => actions.components.blockPage.course.submitCourseReview
  );
  const [afterReviewDoneCallback, setAfterReviewDoneCallback] = useState(null);
  const [isCourseAlreadyCompleted, setIsCourseAlreadyCompleted] =
    useState(null);
  const [wasCourseReviewDialogDisplay, setWasCourseReviewDialogDisplay] =
    useState(false);
  const setCourseReview = useStoreActions(
    (actions) => actions.components.blockPage.course.setReview
  );

  // adaptest
  const module = useStoreState((state) => state.components.blockPage.module);
  const isModuleCompletedByAdaptest = useStoreState(
    (state) => state.components.blockPage.module.isCompletedByAdaptest
  );
  const mustSkipModuleCompletedByAdaptestModal = useStoreState(
    (state) => state.session.mustSkipModuleCompletedByAdaptestModal
  );
  const setMustSkipModuleCompletedByAdaptestModal = useStoreActions(
    (actions) => actions.session.setMustSkipModuleCompletedByAdaptestModal
  );

  useEffect(() => {
    const contentEl = contentRef.current;
    if (!contentEl) {
      return;
    }

    contentEl.querySelectorAll("iframe").forEach((iframe) => {
      // console.log("iframe:", iframe, iframe.getAttribute( 'width' ));
      // console.log("contentEl:", contentEl, contentEl.offsetWidth);
      var changeRatio = contentEl.offsetWidth / iframe.getAttribute("width");
      if (changeRatio < 1) {
        iframe.style.width = `${changeRatio * iframe.getAttribute("width")}px`;
        iframe.style.height = `${
          changeRatio * iframe.getAttribute("height")
        }px`;
      }
    });
  }, []);

  useEffect(() => {
    if (
      isModuleCompletedByAdaptest &&
      !mustSkipModuleCompletedByAdaptestModal[module.id]
    ) {
      showModuleAcceptedByAdaptestModal();
    }
  }, [isModuleCompletedByAdaptest]);

  useEffect(() => {
    if (!course || !course.slug) {
      return;
    }

    setIsCourseAlreadyCompleted(course.isCompleted);
  }, [course]);

  useEffect(() => {
    // console.log("block.nextBlockSlug:", block.nextBlockSlug);

    const mustDisplayQuiz =
      block.contentType === "test" && !!_.get(quiz, "id") && !!quiz.questions;
    setMustDisplayQuiz(mustDisplayQuiz);

    const mustDisplayTask = !block.isCompleted && block.contentType === "task";
    setMustDisplayTask(mustDisplayTask);
  }, [quiz, block]);

  useEffect(() => {
    setIsTaskUploaded(false);
    setIsBlockCompletedByGuest({ block, module });
  }, []);

  useEffect(() => {
    if (!session.isLoaded) {
      return;
    }

    if (!(mustDisplayQuiz || mustDisplayTask || !block.isAvailableForGuest)) {
      return;
    }

    if (!session.isLoggedIn) {
      if (block.contentType === "task") {
        modals.registerToAccessTaskModal({
          modalDispatch,
          router,
          onClose: (params) => {
            router.push(`/courses/${block.courseSlug}`);
          },
        });
      } else if (block.contentType === "test" && quiz.isAdaptest) {
        modals.registerToAccessAdaptestModal({
          modalDispatch,
          router,
          onClose: (params) => {
            router.push(`/courses/${block.courseSlug}`);
          },
        });
      } else {
        modals.registerToContinueModal({
          modalDispatch,
          router,
          onClose: (params) => {
            router.push(`/courses/${block.courseSlug}`);
          },
        });
      }

      return;
    }

    if (isTaskUploaded) {
      showTaskOnAprovalModal();
      return;
    }

    if (mustDisplayQuiz && block.isCompleted) {
      if (course.isCompleted && !course.review) {
        return;
      }

      showQuizBlockAlreadyCompleted();
      return;
    }
  }, [
    session,
    mustDisplayQuiz,
    mustDisplayTask,
    isTaskUploaded,
    course,
    block,
  ]);

  useEffect(() => {
    // console.log("uploadedTask:", uploadedTask);
    if (uploadedTask === null) {
      return;
    }

    setIsTaskUploaded(true);
  }, [uploadedTask]);

  useEffect(() => {
    // console.log("afterReviewDoneCallback in useEffect:", afterReviewDoneCallback);
    if (!afterReviewDoneCallback) {
      return;
    }

    if (!wasCourseReviewDialogDisplay) {
      showRateCourseModal();
    }
  }, [afterReviewDoneCallback, wasCourseReviewDialogDisplay]);

  useEffect(() => {
    if (course.isCompleted && !course.review) {
      // console.log("course in useEffect:", course);
      setWasCourseReviewDialogDisplay(true);
      showRateCourseModal();
    }
    // showCourseCompletedWithCertificatesModal({course});
    // showTrackCompletedWithCertificatesModal({track: course});
    if (course.isCompleted) {
    }
  }, [course]);

  return (
    <div className={styles.block}>
      {!mustDisplayQuiz && (
        <div className={styles.blockTitle}>
          <h1 dangerouslySetInnerHTML={{ __html: block.title?.rendered }} />
        </div>
      )}

      {!mustDisplayQuiz && (session.isLoggedIn || block.isAvailableForGuest) && (
        <div ref={contentRef} className={styles.content}>
          <BlockContent />
        </div>
      )}

      {actionStartLoading && (
        <div className={styles.actionsLoader}>
          <Loader />
        </div>
      )}

      {!actionStartLoading && (
        <>
          {mustDisplayQuiz && session.isLoggedIn && (
            <Quiz
              completeBlockDoneCallback={completeBlockDoneCallback}
              setActionStartLoadingBlock={setActionStartLoading}
            />
          )}

          {mustDisplayTask && session.isLoggedIn && !isTaskUploaded && <Task />}

          {block.contentType === "adaptest-intro" && (
            <div className={styles.adaptestBanner}>
              <AdaptestBanner
                block={
                  {
                    ...block,
                    title: {
                      rendered: "Сэкономьте время и найдите пробелы в знаниях",
                    },
                    excerpt: {
                      rendered:
                        "Мы зачтём модули, которые вы уже знаете.\nА то, что вам не известно, узнаете из курса.",
                    },
                  } as IBlockState
                }
                mustDisplayAdaptestLink={false}
              />
            </div>
          )}

          {!mustDisplayQuiz &&
            !mustDisplayTask &&
            block.contentType !== "adaptest-intro" && (
              <BlockActions
                block={block}
                setActionStartLoading={setActionStartLoading}
                completeBlockDoneCallback={completeBlockDoneCallback}
              />
            )}

          {block.contentType === "adaptest-intro" && (
            <AdaptestIntoActions
              block={block}
              setActionStartLoading={setActionStartLoading}
              completeBlockDoneCallback={completeBlockDoneCallback}
            />
          )}
        </>
      )}
    </div>
  );

  function showTaskOnAprovalModal() {
    modalDispatch({
      type: "template",
      payload: {
        size: "md",
        type: "primary",
        title: "Задание на проверке",
        onClose: (params) => {
          if (params && params.mustSkipOnClose) {
            return;
          }
          router.push(`/courses/${block.courseSlug}`);
        },
        content: ({ closeModal }) => (
          <>
            <p className={stylesModal.modalText}>
              Мы проверим ваше задание и напишем вам
              <br />в ближайшее время!
            </p>
            <div className={stylesModal.modalActions}>
              <Button
                className="btn_primary"
                onClick={() => {
                  closeModal();
                }}
              >
                Вернуться к курсу
              </Button>
            </div>
          </>
        ),
      },
    });
    modalDispatch({ type: "open" });
  }

  function completeBlockDoneCallback(params) {
    // console.log("completeBlockDoneCallback...");
    // console.log(params);
    // console.log("isNeedCourseReview:", isNeedCourseReview)
    // console.log("isCourseAlreadyCompleted:", isCourseAlreadyCompleted)

    if (params.completedTrackSlug && !isCourseAlreadyCompleted) {
      setActionStartLoading(false);
      setAfterReviewDoneCallback({
        callback: () => {
          // showTrackCompletedModal();
          showTrackCompletedWithCertificatesModal({
            trackSlug: params.completedTrackSlug,
          });
        },
      });
    } else if (params.completedCourseSlug && !isCourseAlreadyCompleted) {
      setActionStartLoading(false);
      setAfterReviewDoneCallback({
        callback: () => {
          // showCourseCompletedModal({nextBlockSlug: params.nextBlockSlug});
          showCourseCompletedWithCertificatesModal({
            courseSlug: params.completedCourseSlug,
          });
        },
      });
    } else if (params.nextBlockSlug) {
      router.push(`/blocks/${params.nextBlockSlug}`);
    } else if (isCourseAlreadyCompleted) {
      router.push(`/courses/${course.slug}`);
    } else {
      setActionStartLoading(false);
    }
  }

  function showTrackCompletedWithCertificatesModal({ trackSlug }) {
    modalDispatch({
      type: "template",
      payload: {
        size: "lg",
        title: "Поздравляем с окончанием трека!",
        layoutType: "cover",
        cover: `url(${trackCompletedCover})`,
        content: ({ closeModal }) => (
          <>
            <p className={stylesModal.modalTextSlim}>
              Вы можете скачать свой сертификат об окончании трека сейчас или
              потом из{" "}
              <Link href="/">
                <a>Личного кабинета</a>
              </Link>
              .
            </p>
            <div className={stylesModal.modalActionsSmallGap}>
              <Button
                className="btn_default"
                onClick={() => {
                  closeModal();
                  router.push("/");
                }}
              >
                Скачаю позже
              </Button>
              <Button
                className="btn_primary"
                onClick={() => {
                  window.location.assign(
                    getRestApiUrl(`/tps/v1/track-certificate/${trackSlug}/pdf`)
                  );
                  // window.open(getRestApiUrl(`/tps/v1/track-certificate/${trackSlug}/pdf`), "_blank");
                }}
              >
                Скачать сертификат
              </Button>
            </div>
          </>
        ),
      },
    });
    modalDispatch({ type: "open" });
  }

  function showCourseCompletedWithCertificatesModal({ courseSlug }) {
    modalDispatch({
      type: "template",
      payload: {
        size: "lg",
        title: "Поздравляем с окончанием курса!",
        layoutType: "cover",
        cover: `url(${courseCompletedCover})`,
        content: ({ closeModal }) => (
          <>
            <p className={stylesModal.modalTextSlim}>
              Вы можете скачать свой сертификат об окончании курса сейчас или
              потом из{" "}
              <Link href="/">
                <a>Личного кабинета</a>
              </Link>
              .
            </p>
            <div className={stylesModal.modalActionsSmallGap}>
              <Button
                className="btn_default"
                onClick={() => {
                  closeModal();
                  router.push("/");
                }}
              >
                Скачаю позже
              </Button>
              <Button
                className="btn_primary"
                onClick={() => {
                  window.location.assign(
                    getRestApiUrl(
                      `/tps/v1/course-certificate/${courseSlug}/pdf`
                    )
                  );
                  // window.open(getRestApiUrl(`/tps/v1/course-certificate/${courseSlug}/pdf`), "_blank");
                }}
              >
                Скачать сертификат
              </Button>
            </div>
          </>
        ),
      },
    });
    modalDispatch({ type: "open" });
  }

  function showQuizBlockAlreadyCompleted() {
    modalDispatch({
      type: "template",
      payload: {
        size: "md",
        type: "warning",
        title: "Вы уже прошли этот тест.",
        onClose: (params) => {
          if (params && params.mustSkipOnClose) {
            return;
          }

          if (!course.isCompleted && !course.review) {
            completeBlock({
              block,
              user,
              doneCallback: completeBlockDoneCallback,
            });
          }
        },
        content: ({ closeModal }) => (
          <>
            <p className={stylesModal.modalText}>Хотите пройти еще раз?</p>
            <div className={stylesModal.modalActions}>
              <Button
                className="btn_primary"
                onClick={() => {
                  initPassingState();
                  setIsCompleted(false);
                  closeModal({ mustSkipOnClose: true });
                }}
              >
                Да
              </Button>
              <Button
                className="btn_reset"
                onClick={() => {
                  closeModal();
                }}
              >
                Пропустить
              </Button>
            </div>
          </>
        ),
      },
    });
    modalDispatch({ type: "open" });
  }

  function showRateCourseModal() {
    modalDispatch({
      type: "template",
      payload: {
        size: "sm",
        title: "Оцени курс!",
        type: "warning",
        content: ({ closeModal }) => (
          <RateCourse
            course={course}
            closeModal={closeModal}
            onSubmit={(rating) => {
              const courseReview = {
                rating,
                text: "",
              };

              if (rating < 5) {
                showMakeReviewModal(courseReview);
              } else {
                submitCourseReview({
                  user,
                  course,
                  courseReview,
                  doneCallback: reviewSubmitted,
                });
                closeModal();
              }
            }}
          />
        ),
      },
    });
    modalDispatch({ type: "open" });
  }

  function showMakeReviewModal(courseReview) {
    modalDispatch({
      type: "template",
      payload: {
        size: "sm",
        title: "Оцени курс!",
        type: "warning",
        content: ({ closeModal }) => (
          <CourseReviewForm
            course={course}
            closeModal={closeModal}
            courseReview={courseReview}
            onSubmit={(review) => {
              submitCourseReview({
                user,
                course,
                courseReview: review,
                doneCallback: reviewSubmitted,
              });
              closeModal();
            }}
          />
        ),
      },
    });
    modalDispatch({ type: "open" });
  }

  function reviewSubmitted(resultData) {
    console.log("resultData:", resultData);
    console.log("afterReviewDoneCallback:", afterReviewDoneCallback);

    // if(resultData && resultData.review) {
    //   setCourseReview(resultData.review);
    // }

    if (afterReviewDoneCallback) {
      afterReviewDoneCallback.callback();
      setAfterReviewDoneCallback(null);
    }
  }

  function showModuleAcceptedByAdaptestModal() {
    modalDispatch({
      type: "template",
      payload: {
        size: "lg",
        layoutType: "alignLeft",
        title: "Этот модуль зачтён адаптационным тестом",
        content: ({ closeModal }) => (
          <>
            <p className={stylesModal.modalTextSlim}>
              Вы можете перейти к следующему модулю или повторить то, что уже
              знаете.
            </p>
            <div className={stylesModal.modalActionsSmallGap}>
              <Button
                className="btn_default"
                onClick={() => {
                  setMustSkipModuleCompletedByAdaptestModal(module.id);
                  closeModal();
                }}
              >
                Пройти зачтённый модуль
              </Button>
              <Button
                className="btn_primary"
                onClick={() => {
                  closeModal();
                  if (block.nextUncompletedBlockSlug) {
                    router.push(`/blocks/${block.nextUncompletedBlockSlug}`);
                  } else {
                    router.push(`/courses/${block.courseSlug}`);
                  }
                }}
              >
                Перейти к следующему
              </Button>
            </div>
          </>
        ),
      },
    });
    modalDispatch({ type: "open" });
  }
};

export default BlockContent;
