import { ReactElement, useEffect, useState } from "react";
import * as _ from "lodash";

import { useStoreState } from "../../model/helpers/hooks";
import InclusiveComponents from "../../inclusive-components/inclusive-components";
import * as C from "../../const";

import styles from "./LearnProgress.module.scss";

import imageChat from "../../assets/img/chat.svg";

const { ProgressBar } = InclusiveComponents;

const LearnProgress: React.FunctionComponent = (): ReactElement => {
  const [progressCourse, setProgressCourse] = useState(null);
  const [progressValue, setProgressValue] = useState(null);
  const [progress, setProgress] = useState(null);
  // const isLoggedIn = useStoreState(state => state.session.isLoggedIn);
  const page = useStoreState((state) => state.page);
  // const homePage = useStoreState(state => state.components.homePage);
  const coursePage = useStoreState((state) => state.components.coursePage);
  const trackPage = useStoreState((state) => state.components.trackPage);
  const blockPage = useStoreState((state) => state.components.blockPage);

  // useEffect(() => {
  //   if (page?.slug !== "glavnaya" || !isLoggedIn) {
  //     return;
  //   }

  //   const course = homePage.studyCourse?.study ?? null;

  //   setProgressCourse(course);
  // }, [page]);

  useEffect(() => {
    if (
      !coursePage ||
      !coursePage.course ||
      !coursePage.course.id ||
      !page ||
      !page.slug
    ) {
      return;
    }

    if (coursePage.course.slug !== page.slug) {
      return;
    }

    // console.log("coursePage:", coursePage);
    setProgressCourse(coursePage.course);
  }, [coursePage, page]);

  useEffect(() => {
    if (
      !blockPage ||
      !blockPage.block ||
      !blockPage.block.id ||
      !page ||
      !page.slug
    ) {
      return;
    }

    if (blockPage.block.slug !== page.slug) {
      return;
    }

    // console.log("blockPage:", blockPage);
    setProgressCourse(blockPage.course);
  }, [blockPage, page]);

  useEffect(() => {
    if (
      !trackPage ||
      !trackPage.track ||
      !trackPage.track.id ||
      !page ||
      !page.slug
    ) {
      return;
    }

    if (trackPage.track.slug !== page.slug) {
      return;
    }

    // console.log("trackPage:", trackPage);
    setProgressValue(
      trackPage.track.numberOfBlocks
        ? Math.floor(
            (trackPage.track.numberOfCompletedBlocks * 100) /
              trackPage.track.numberOfBlocks
          )
        : 0
    );
  }, [trackPage, page]);

  useEffect(() => {
    if (!progressCourse) {
      return;
    }

    // console.log("progressCourse.numberOfCompletedBlocks:", progressCourse.numberOfCompletedBlocks);
    // console.log("progressCourse.numberOfBlocks:", progressCourse.numberOfBlocks);
    setProgressValue(
      progressCourse.numberOfBlocks
        ? Math.floor(
            (progressCourse.numberOfCompletedBlocks * 100) /
              progressCourse.numberOfBlocks
          )
        : 0
    );
  }, [progressCourse]);

  useEffect(() => {
    // console.log("progressValue:", progressValue);

    if (progressValue === null) {
      return;
    }

    setProgress({
      valueNow: progressValue,
      valueText: `Прогресс обучения ${progressValue}%`,
      label: "Прогресс обучения",
      visibleText: `Прогресс ${progressValue}%`,
    });
  }, [progressValue]);

  if (!progress) {
    return null;
  }

  return (
    <div className={styles.container}>
      <ProgressBar {...progress}>
        <a
          className={styles.link}
          href={C.TEPLO_CONTACTS.TELEGRAM}
          target="_blank"
        >
          <img src={imageChat} />
          <span>Чат</span>
        </a>
      </ProgressBar>
    </div>
  );
};

export default LearnProgress;
