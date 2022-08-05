import { action, computed, thunk } from "easy-peasy";
import * as _ from "lodash";

import {
  IStoreModel,
  IProfileModel,
  IProfileState,
  IProfileActions,
  IProfileThunks,
  IFetchResult,
  IUserState
} from "../model.typing";
import { stripTags, getAjaxUrl, getRestApiUrl, tokenFetch } from "../../utilities/utilities";
import { userInitialState } from "../base/user-model";

export const profileState: IProfileState = {
  ..._.cloneDeep(userInitialState),
  city: "",
  description: "",
  socialLinks: [],
  isEmptyProfile: true,
};

const profileActions: IProfileActions = {
  initializeState: action((prevState) => {
    Object.assign(prevState, profileState);
  }),
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState);
  }),
  setAvatar: action((prevState, newItvAvatar) => {
    prevState.avatar = newItvAvatar;
  }),
  setAvatarFile: action((prevState, file) => {
    prevState.avatarFile = file;
  }),
  fullName: computed((state) => {
    return getFullName(state as IUserState);
  }),
};

const profileThunks: IProfileThunks = {
  uploadUserAvatarRequest: thunk(
    async (
      actions,
      { profile, file, doneCallback },
      { getStoreState }
    ) => {
      if (!file) return;

      const formData = new FormData();
      formData.append( 'file', file );
      formData.append( 'title', file.name );

      try {
        const result = await tokenFetch(getRestApiUrl(`/wp/v2/media`), {
          method: "post",
          // headers: {"Content-Type": "application/json"},
          headers: {"X-WP-Nonce": profile.fileUploadNonce},
          body: formData,
        });

        if (result.ok) {
          // console.log("profile updated ok");
          const data = await result.json();
          // console.log("upload result data:", data);
          doneCallback({...data});
        } else {
          const { code: errorCode, message: errorMessage } = await (<
            Promise<{
              code: string;
              message: string;
            }>
          >result.json());

          console.error("errorCode:", errorCode);

          // doneCallback({error: stripTags(errorMessage)});
          doneCallback({error: "При обновлении профиля произошла ошибка!"});
        }

      } catch (error) {
        doneCallback({error: "При обновлении профиля произошла ошибка!"});
        console.error(error);
      }
    }
  ),
  updateProfileRequest: thunk(
    async (
      actions,
      { profile, formData, doneCallback },
      { getStoreState }
    ) => {
      if (!formData) return;

      try {
        const result = await tokenFetch(getRestApiUrl(`/tps/v1/user/update-profile`), {
          method: "post",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(formData),
        });

        if (result.ok) {
          // console.log("profile updated ok");
          doneCallback();
        } else {
          const { code: errorCode, message: errorMessage } = await (<
            Promise<{
              code: string;
              message: string;
            }>
          >result.json());

          console.error("errorCode:", errorCode);

          // doneCallback({error: stripTags(errorMessage)});
          doneCallback({error: "При обновлении профиля произошла ошибка!"});
        }

      } catch (error) {
        doneCallback({error: "При обновлении профиля произошла ошибка!"});
        console.error(error);
      }
    }
  ),
  loadProfileRequest: thunk(
    async (
      actions,
      { profile, doneCallback },
      { getStoreState }
    ) => {
      try {
        const {error: loadProfileError, data: freshProfile} = await requestProfile(profile.slug)
        doneCallback(!loadProfileError ? {freshProfile} : {error: loadProfileError});
      } catch (error) {
        console.error(error);
        doneCallback({error: "При обновлении профиля произошла ошибка!"});
      }
    }
  ),
};

export async function requestProfile(slug) {
  let error = "";
  let data = {};

  try {
    let url = new URL(getRestApiUrl(`/wp/v2/users`));
    url.search = new URLSearchParams({slug}).toString();

    const response = await tokenFetch(url);

    if(!response.ok) {
      ({ message: error } = await response.json());
    } else {
      const responseData = await response.json();
      data = _.get(responseData, "0", {});
    }
  } catch (error) {
    console.error(error);
    error = "Ошибка!";
  }

  // console.log("requestProfile data:", data);
  return {error, data: data as IProfileState};
}

export function getFullName(state: IUserState) {
  let fullNameParts = [];
  if(_.trim(state.firstName)) {
    fullNameParts.push(state.firstName);
  }
  if(_.trim(state.lastName)) {
    fullNameParts.push(state.lastName);
  }
  return fullNameParts.join(" ");
}

const profileModel: IProfileModel = {
  ...profileState,
  ...profileActions,
  ...profileThunks,
};

export default profileModel;
