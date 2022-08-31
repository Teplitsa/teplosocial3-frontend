import { ReactElement, useState, useContext } from "react";
import * as _ from "lodash";
import Link from "next/link";

import { IProfileState, IUserState } from "../../../model/model.typing";
import { useStoreState, useStoreActions } from "../../../model/helpers/hooks";
import Loader from "../../Loader";
import * as profileUtils from "../../../model/member/profile-model";
import InclusiveComponents from "../../../inclusive-components/inclusive-components";

import styles from "./Avatar.module.scss";

import imageCamera from "../../../assets/img/camera.svg";
import imageCameraBlue from "../../../assets/img/camera-blue.svg";

const { SnackbarContext } = InclusiveComponents;

const Avatar: React.FunctionComponent<{
  profile: IProfileState;
}> = ({ profile }): ReactElement => {
  const setProfileState = useStoreActions(
    (actions) => actions.components.profileEditPage.profile.setState
  );
  const uploadUserAvatarRequest = useStoreActions(
    (actions) =>
      actions.components.profileEditPage.profile.uploadUserAvatarRequest
  );
  const updateProfileRequest = useStoreActions(
    (actions) => actions.components.profileEditPage.profile.updateProfileRequest
  );
  const loadProfileRequest = useStoreActions(
    (actions) => actions.components.profileEditPage.profile.loadProfileRequest
  );

  const [hasFailedUploading, setFailedUploading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const { dispatch: snackbarDispatch } = useContext(SnackbarContext);

  function showMessage(text, type = "error") {
    snackbarDispatch({
      type: "add",
      payload: {
        messages: [
          {
            context: type as "error" | "success",
            text: text,
          },
        ],
      },
    });
  }

  function handleFileUploaded(params: any = {}) {
    if (params.error) {
      showMessage(params.error);
      setIsUploadingImage(false);
      return;
    }

    updateProfileRequest({
      profile,
      formData: { user_avatar: params.id },
      doneCallback: handleProfileUpdated,
    });
  }

  function handleProfileUpdated(params: any = {}) {
    if (params.error) {
      showMessage(params.error);
      setIsUploadingImage(false);
      return;
    }

    loadProfileRequest({ profile, doneCallback: handleFreshProfileLoaded });
  }

  function handleFreshProfileLoaded(params: any = {}) {
    setIsUploadingImage(false);

    if (params.error) {
      showMessage(params.error);
      return;
    }

    setProfileState(params.freshProfile);
  }

  function announceUploadFail() {
    setFailedUploading(true);
    setTimeout(() => setFailedUploading(false), 5000);
  }

  return (
    <div className={styles.header}>
      {!!profile.avatar && (
        <div
          className={
            !profile.avatarFile
              ? styles.fileInputContainer
              : styles.fileInputContainerBig
          }
        >
          <input
            type="file"
            onChange={(event) => {
              if (!event.currentTarget.files[0]) return;
              setIsUploadingImage(true);
              uploadUserAvatarRequest({
                profile,
                file: event.currentTarget.files[0],
                doneCallback: handleFileUploaded,
                failCallback: announceUploadFail,
              });
            }}
          />
          <div
            className={
              !profile.avatarFile
                ? styles.avatarWrapper
                : styles.avatarWrapperBig
            }
          >
            <div
              className={!profile.avatarFile ? styles.avatar : styles.avatarBig}
            >
              {isUploadingImage && <Loader />}
              {!isUploadingImage && (
                <>
                  {!!profile.avatarFile ? (
                    <>
                      <img
                        className={
                          !profile.avatar
                            ? styles.avatarImage
                            : styles.avatarImageBig
                        }
                        src={profile.avatar}
                        alt={`Фото профиля ${profileUtils.getFullName(
                          profile as IUserState
                        )}!`}
                      />
                      <img
                        className={styles.cameraIcon}
                        src={imageCamera}
                        alt=""
                      />
                    </>
                  ) : (
                    <>
                      <div className={styles.noAvatar}></div>
                      <img
                        className={styles.cameraIcon}
                        src={imageCameraBlue}
                        alt=""
                      />
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {!profile.avatarFile && (
        <div className={styles.uploadInfo}>
          <h5>Загрузите фото профиля</h5>
          {hasFailedUploading ? (
            <p className={styles.mistake}>
              Эту фотографию мы загрузить не можем. Попробуйте другую в формате
              JPEG, PNG, GIF не более 2 MB
            </p>
          ) : (
            <p>
              Можно загрузить файл формата JPEG, PNG, GIF и размером не более 2
              MB
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Avatar;
