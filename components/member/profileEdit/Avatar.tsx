import { ReactElement, useState, useContext } from "react";
import * as _ from "lodash";
import Link from "next/link";

import {
  IProfileState,
  IUserState,
} from "../../../model/model.typing";
import { useStoreState, useStoreActions } from "../../../model/helpers/hooks";
import Loader from "../../Loader";
import * as profileUtils from "../../../model/member/profile-model";
import InclusiveComponents from "../../../inclusive-components/inclusive-components";

import styles from './Avatar.module.scss';

import imageCamera from "../../../assets/img/camera.svg";

const {
  SnackbarContext
} = InclusiveComponents;

const Avatar: React.FunctionComponent<{
  profile: IProfileState,
}> = ({
  profile, 
}): ReactElement => {
  const setProfileState = useStoreActions(actions => actions.components.profileEditPage.profile.setState);
  const uploadUserAvatarRequest = useStoreActions(actions => actions.components.profileEditPage.profile.uploadUserAvatarRequest);
  const updateProfileRequest = useStoreActions(actions => actions.components.profileEditPage.profile.updateProfileRequest);
  const loadProfileRequest = useStoreActions(actions => actions.components.profileEditPage.profile.loadProfileRequest);

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const { dispatch: snackbarDispatch } = useContext(SnackbarContext);

  function showMessage(text, type="error") {
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

  function handleFileUploaded(params:any = {}) {
    if(params.error) {
      showMessage(params.error);
      setIsUploadingImage(false);
      return;
    }

    updateProfileRequest({profile, formData: {user_avatar: params.id}, doneCallback: handleProfileUpdated})
  }

  function handleProfileUpdated(params:any = {}) {
    if(params.error) {
      showMessage(params.error);
      setIsUploadingImage(false);
      return;
    }

    loadProfileRequest({profile, doneCallback: handleFreshProfileLoaded});
  }

  function handleFreshProfileLoaded(params:any={}) {
    setIsUploadingImage(false);

    if(params.error) {
      showMessage(params.error);
      return;
    }

    setProfileState(params.freshProfile);
  }

  return (
    <div className={styles.header}>
      {!!profile.avatar &&
      <div className={styles.fileInputContainer}>
        <input
          type="file"
          onChange={(event) => {
            if (!event.currentTarget.files[0]) return;
            setIsUploadingImage(true);
            uploadUserAvatarRequest({profile, file: event.currentTarget.files[0], doneCallback: handleFileUploaded});
          }}
        />
        <div className={styles.avatarWrapper}>
          <div className={styles.avatar}>
            {isUploadingImage && <Loader />}
            {!isUploadingImage &&
              <>
                {!!profile.avatar
                  ? <img className={styles.avatarImage} src={profile.avatar} alt={`Фото профиля ${profileUtils.getFullName(profile as IUserState)}!`} />
                  : <div className={styles.noAvatar}></div>
                }
                <img className={styles.cameraIcon} src={imageCamera} alt="" />
              </>
            }
          </div>
        </div>
      </div>
      }
    </div>
  );
};

export default Avatar;
