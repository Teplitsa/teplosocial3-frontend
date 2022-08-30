import { ReactElement, MouseEvent, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import InclusiveComponents from "../../inclusive-components/inclusive-components";

import * as utils from "../../utilities/utilities";
import DefaultCoverImage from "./img/default-cover.svg";
import {
  getRestApiUrl,
  getDeclension,
  convertObjectToClassName,
} from "../../utilities/utilities";
import { getMediaData, IMediaData } from "../../utilities/media";
import { ICourseCard } from "../../model/model.typing";
import styles from "./CourseCard.module.scss";
import HintTooltip from "components/HintTooltip";
import { roundDownMinutes } from "utilities/roundDownMinutes";

const { ProgressBar } = InclusiveComponents;

const CourseCard: React.FunctionComponent<ICourseCard> = ({
  mediaId,
  thumbnail,
  smallThumbnail,
  duration,
  title,
  teaser,
  url,
  isCompleted,
  progress,
  certificates,
  btnText = "Начать обучение",
  template = "default",
  trackId,
  trackSlug,
  trackTitle,
}): ReactElement => {
  let cover: string = null;
  const durationComponents = {
    hours: Math.floor(duration / 60),
    minutes: roundDownMinutes(duration),
  };

  const courseCardRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const [media, setMedia] = useState<IMediaData>(null);
  const [showHint, setShowHint] = useState(false);

  switch (template) {
    case "default":
      cover = thumbnail;
      break;
    case "small-thumbnail":
      cover = smallThumbnail;
      break;
  }

  useEffect(() => {
    const handleClick = (event: Event) => {
      const targetElement = event.target as HTMLElement;

      if (
        !targetElement.classList.contains(styles["course-card__track"]) &&
        !targetElement.classList.contains(styles["course-card__action"]) &&
        !targetElement.classList.contains(
          styles["course-card__certificate-list-item-link"]
        )
      ) {
        handleRegisterButtonClick();
      }
    };

    courseCardRef.current?.addEventListener("click", handleClick, true);

    return () =>
      courseCardRef.current?.removeEventListener("click", handleClick);
  }, [courseCardRef.current]);

  useEffect(() => {
    if (thumbnail || !mediaId) return;

    const abortController = new AbortController();

    (async () => {
      const media = await getMediaData(mediaId, abortController);

      if (!Object.is(media, null)) {
        setMedia(media);
      }

      return () => abortController.abort();
    })();
  }, [mediaId]);

  function handleRegisterButtonClick(): void {
    router.push(url);
  }

  return (
    <div
      className={convertObjectToClassName({
        [styles["course-card"]]: true,
        [styles[`course-card_${template}`]]: Boolean(
          styles[`course-card_${template}`]
        ),
      })}
      ref={courseCardRef}
    >
      {template === "default" && (
        <img
          className={styles["course-card__cover"]}
          src={
            cover ??
            media?.mediaItemSizes.course_cover.source_url ??
            DefaultCoverImage
          }
          width={media?.mediaItemSizes.course_cover.width ?? 354}
          height={media?.mediaItemSizes.course_cover.height ?? 185}
          alt={typeof title === "string" ? title : ""}
        />
      )}
      <div className={styles["course-card__entry"]}>
        <div
          className={convertObjectToClassName({
            [styles["course-card__header"]]: true,
            [styles[`course-card__header_${template}`]]: Boolean(
              styles[`course-card__header_${template}`]
            ),
          })}
        >
          <h3
            className={convertObjectToClassName({
              [styles["course-card__title"]]: true,
              [styles[`course-card__title_${template}`]]: Boolean(
                styles[`course-card__title_${template}`]
              ),
            })}
          >
            {utils.decodeHtmlEntities(title)}
          </h3>
          {template === "small-thumbnail" && (
            <img
              className={convertObjectToClassName({
                [styles["course-card__cover"]]: true,
                [styles[`course-card__cover_${template}`]]:
                  template === "small-thumbnail",
              })}
              src={
                cover ??
                media?.mediaItemSizes.course_cover.source_url ??
                DefaultCoverImage
              }
              width={media?.mediaItemSizes.course_cover.width ?? 90}
              height={media?.mediaItemSizes.course_cover.height ?? 90}
              alt={typeof title === "string" ? title : ""}
            />
          )}
        </div>
        <div className={styles["course-card__meta"]}>
          {!!trackId && (
            <Link href={`/tracks/${trackSlug}`}>
              <a className={styles["course-card__track"]}>{trackTitle}</a>
            </Link>
          )}
          <span
            className={styles["course-card__duration"]}
            onMouseEnter={() => setShowHint(true)}
            onMouseLeave={() => setShowHint(false)}
          >
            {durationComponents.hours > 0 ? `${durationComponents.hours} ` : ""}
            {durationComponents.hours > 0 &&
              getDeclension({
                count: durationComponents.hours,
                caseOneItem: "час",
                caseTwoThreeFourItems: "часа",
                restCases: "часов",
              })}
            {durationComponents.hours > 0 && " "}
            {durationComponents.minutes > 0
              ? `${durationComponents.minutes} `
              : ""}
            {durationComponents.minutes > 0 &&
              getDeclension({
                count: durationComponents.minutes ?? 0,
                caseOneItem: "минута",
                caseTwoThreeFourItems: "минуты",
                restCases: "минут",
              })}
            {showHint && <HintTooltip />}
          </span>
        </div>
        {(certificates?.horizontal || certificates?.vertical) && (
          <ul className={styles["course-card__certificate-list"]}>
            {certificates?.horizontal && (
              <li className={styles["course-card__certificate-list-item"]}>
                <a
                  className={styles["course-card__certificate-list-item-link"]}
                  href={getRestApiUrl(
                    `/tps/v1/certificate/${certificates.horizontal}/pdf`
                  )}
                  download
                >
                  {/* Горизонтальный сертификат */}
                  Сертификат
                </a>
              </li>
            )}
            {certificates?.vertical && (
              <li className={styles["course-card__certificate-list-item"]}>
                <a
                  className={styles["course-card__certificate-list-item-link"]}
                  href={getRestApiUrl(
                    `/tps/v1/certificate/${certificates.vertical}/pdf`
                  )}
                  download
                >
                  Вертикальный сертификат
                </a>
              </li>
            )}
          </ul>
        )}
        {!(certificates?.horizontal || certificates?.vertical) && teaser && (
          <div
            className={styles["course-card__resume"]}
            dangerouslySetInnerHTML={{ __html: teaser }}
          />
        )}
        {!(certificates?.horizontal || certificates?.vertical) &&
          (isCompleted || progress) && (
            <div className={styles["course-card__progress"]}>
              {progress && (
                <ProgressBar
                  {...{
                    valueNow: Number.parseInt(progress),
                    valueText: `Прогресс обучения ${progress}`,
                    label: "Прогресс обучения",
                    visibleText: `Пройдено ${progress}`,
                    footerAlign: "center",
                  }}
                />
              )}
              {isCompleted && (
                <ProgressBar
                  {...{
                    valueNow: 100,
                    valueText: `Прогресс обучения ${progress}`,
                    label: "Прогресс обучения",
                    visibleText: null,
                    footerAlign: "center",
                    disabled: true,
                  }}
                >
                  <span
                    className={convertObjectToClassName({
                      [styles["course-card__progress-caption"]]: true,
                      [styles["course-card__progress-caption_completed"]]:
                        Boolean(
                          styles["course-card__progress-caption_completed"]
                        ),
                    })}
                  >
                    "Курс пройден!"
                  </span>
                </ProgressBar>
              )}
            </div>
          )}
        <Link href={url}>
          <a
            className={convertObjectToClassName({
              [styles["course-card__action"]]: true,
              [styles["course-card__action_uninvolved"]]:
                !progress &&
                !isCompleted &&
                Boolean(styles["course-card__action_uninvolved"]),
              [styles["course-card__action_progress"]]:
                progress && Boolean(styles["course-card__action_progress"]),
              [styles["course-card__action_completed"]]:
                isCompleted && Boolean(styles["course-card__action_completed"]),
            })}
          >
            {btnText}
          </a>
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
