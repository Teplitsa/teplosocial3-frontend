import { thunk, action, computed, actionOn } from "easy-peasy";
import * as _ from "lodash";
import Cookies from "js-cookie";
import SsrCookie from "ssr-cookie";

import {
  ISessionModel,
  ISessionState,
  ISessionUserState,
  ISessionToken,
  ISessionActions,
  ISessionThunks,
  IFetchResult,
  IRestApiResponse,
} from "./model.typing";
import * as C from "../const";
import {
  getLoginUrl,
  stripTags,
  getRestApiUrl,
  JSONToFormData,
} from "../utilities/utilities";
import * as utils from "../utilities/utilities";
import { userInitialState } from "./base/user-model";
import * as guestPassingState from "./learn/guest-passing-state";

const sessionUserState: ISessionUserState = {
  ..._.cloneDeep(userInitialState),
};

const sessionTokenState: ISessionToken = {
  timestamp: 0,
  authToken: "",
  refreshToken: "",
};

const sessionState: ISessionState = {
  isLoaded: false,
  mustSkipModuleCompletedByAdaptestModal: {},
  user: sessionUserState,
  token: sessionTokenState,
  validToken: computed(
    [(state) => state.token],
    ({ timestamp, authToken, refreshToken }) =>
      Date.now() - timestamp < Number(process.env.AuthTokenLifeTimeMs)
        ? authToken
        : refreshToken
  ),
  isLoggedIn: computed([(state) => state.user.slug], (slug) => Boolean(slug)),
  isAdmin: computed([(state) => state.user.isAdmin], (isAdmin) =>
    Boolean(isAdmin)
  ),
};

export const queriedFields = {
  token: Object.keys(sessionTokenState) as Array<keyof ISessionToken>,
  user: Object.keys(sessionUserState) as Array<keyof ISessionUserState>,
};

const sessionActions: ISessionActions = {
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState);
  }),
  setIsLoaded: action((state, payload) => {
    state.isLoaded = payload;
  }),
  setUserAvatar: action((state, payload) => {
    state.user.avatar = payload;
  }),
  setUserAvatarFile: action((state, payload) => {
    state.user.avatarFile = payload;
  }),
  setMustSkipModuleCompletedByAdaptestModal: action((state, payload) => {
    state.mustSkipModuleCompletedByAdaptestModal = {
      ...state.mustSkipModuleCompletedByAdaptestModal,
      [payload]: true,
    };
  }),
};

const sessionThunks: ISessionThunks = {
  register: thunk(
    async ({ setState }, { formData, successCallbackFn, errorCallbackFn }) => {
      const formDataExtended = {
        ...formData,
        modulePassingState: guestPassingState.getModulesPassingState(),
      };

      try {
        const result = await utils.tokenFetch(
          getRestApiUrl("/tps/v1/auth/register"),
          {
            method: "post",
            body: JSON.stringify(formDataExtended),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (result.ok) {
          const { token: authToken, user: user } = await (<
            Promise<{
              token: string;
              user: any;
            }>
          >result.json());

          Cookies.set(C.TEPLO_COOKIE.AUTH_TOKEN.name, authToken, {
            expires: C.TEPLO_COOKIE.AUTH_TOKEN.expireDays,
          });

          guestPassingState.deleteModulesPassingState();

          setState({
            token: { timestamp: Date.now(), authToken, refreshToken: null },
            user,
            isLoaded: true,
          });

          // console.log("set session isLoaded on ok");

          successCallbackFn();
        } else {
          const { code: errorCode, message: errorMessage } = await (<
            Promise<{
              code: string;
              message: string;
            }>
          >result.json());

          // console.error("errorCode:", errorCode);
          // console.error("set session isLoaded on fail");

          errorCallbackFn(stripTags(errorMessage));
        }
      } catch (error) {
        console.error(error);
        errorCallbackFn("Во время регистрации произашла ошибка.");
      }
    }
  ),
  login: thunk(
    async ({ setState }, { formData, successCallbackFn, errorCallbackFn }) => {
      const formDataExtended = {
        ...formData,
        modulePassingState: guestPassingState.getModulesPassingState(),
      };

      try {
        // console.log(formDataExtended);
        const result = await utils.tokenFetch(
          getRestApiUrl("/tps/v1/auth/login"),
          {
            method: "post",
            body: JSON.stringify(formDataExtended),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (result.ok) {
          const { token: authToken, user: user } = await (<
            Promise<{
              token: string;
              user: any;
            }>
          >result.json());

          // console.error("set session isLoaded on ok");

          Cookies.set(C.TEPLO_COOKIE.AUTH_TOKEN.name, authToken, {
            expires: C.TEPLO_COOKIE.AUTH_TOKEN.expireDays,
          });

          guestPassingState.deleteModulesPassingState();

          setState({
            token: { timestamp: Date.now(), authToken, refreshToken: null },
            user,
            isLoaded: true,
          });

          successCallbackFn();
        } else {
          const { code: errorCode, message: errorMessage } = await (<
            Promise<{
              code: string;
              message: string;
            }>
          >result.json());

          errorCallbackFn(
            errorCode === "incorrect_password"
              ? errorMessage
              : stripTags(errorMessage)
          );
        }
      } catch (error) {
        console.error(error);
        errorCallbackFn("Попытка входа в систему не удалась.");
      }
    }
  ),
  logout: thunk(async ({ setState }) => {
    Cookies.remove(C.TEPLO_COOKIE.AUTH_TOKEN.name);

    setState({
      token: { timestamp: Date.now(), authToken: null, refreshToken: null },
      user: sessionUserState,
      isLoaded: true,
    });
  }),
  retrievePassword: thunk(
    async (actions, { formData, successCallbackFn, errorCallbackFn }) => {
      try {
        const result = await utils.tokenFetch(
          getRestApiUrl("/tps/v1/auth/retrieve-password"),
          {
            method: "post",
            body: JSON.stringify(formData),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const { status: responseStatus, message: responseMessage } = await (<
          Promise<IFetchResult>
        >result.json());

        if (responseStatus === "error") {
          errorCallbackFn(stripTags(responseMessage));
        } else {
          successCallbackFn();
        }
      } catch (error) {
        console.error(error);
        errorCallbackFn("Не удалось отправить пароль.");
      }
    }
  ),
  changePassword: thunk(
    async (actions, { formData, successCallbackFn, errorCallbackFn }) => {
      try {
        const result = await utils.tokenFetch(
          getLoginUrl() + "?action=resetpass",
          {
            method: "post",
            body: JSONToFormData(formData),
          }
        );

        const text = result.ok ? await result.text() : "";

        if (text.match(/Ваш новый пароль вступил в силу/)) {
          successCallbackFn();
        } else {
          errorCallbackFn("Не удалось изменить пароль.");
        }
      } catch (error) {
        console.error(error);
        errorCallbackFn("Не удалось изменить пароль.");
      }
    }
  ),
  changePasswordByAuthorizedUser: thunk(
    async (actions, { formData, successCallbackFn, errorCallbackFn }) => {
      try {
        const result = await utils.tokenFetch(
          getRestApiUrl("/tps/v1/auth/change-password"),
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        const response = await (<Promise<IRestApiResponse>>result.json());

        const {
          data: { status: responseStatus },
          message: responseMessage,
        } = response;

        console.log(response);

        if (responseStatus === 201) {
          successCallbackFn();
        } else {
          errorCallbackFn(stripTags(responseMessage));
        }
      } catch (error) {
        console.error(error);
        errorCallbackFn("Не удалось сменить пароль.");
      }
    }
  ),
  authorizeSession: thunk(async ({ setState, setIsLoaded }) => {
    try {
      const result = await utils.tokenFetch(
        getRestApiUrl("/tps/v1/auth/validate-token"),
        {
          method: "post",
        }
      );

      var isAuthOk = false;

      if (result.ok) {
        try {
          const { token: authToken, user: user } = await (<
            Promise<{
              token: string;
              user: any;
            }>
          >result.json());

          if (authToken) {
            setState({
              token: { timestamp: Date.now(), authToken, refreshToken: null },
              user,
              isLoaded: true,
            });

            isAuthOk = true;
          }
        } catch (error) {}
      }

      if (!isAuthOk) {
        setState({
          token: { timestamp: Date.now(), authToken: null, refreshToken: null },
          user: sessionUserState,
          isLoaded: true,
        });
      }
    } catch (error) {
      console.error("set session isLoaded on exception");
      setIsLoaded(true);
      console.error(error);
    }
  }),
};

export async function authorizeSessionSSRFromRequest(
  req,
  res
): Promise<ISessionState> {
  const cookieSSR = new SsrCookie(req, res);
  const session = await authorizeSessionSSR(cookieSSR);

  if (
    !session.user.id &&
    decodeURIComponent(req.headers.cookie).match(
      /wordpress_logged_in_[^=]+=([^|]+)/
    )
  ) {
    session.isLoaded = false;
  }

  return session;
}

export async function authorizeSessionSSR(cookieSSR): Promise<ISessionState> {
  const guestSession = {
    token: { timestamp: Date.now(), authToken: null, refreshToken: null },
    user: sessionUserState,
    isLoaded: true,
  } as ISessionState;

  try {
    const cookieAuthToken = cookieSSR.get("tps-token");
    // console.log("cookieAuthToken:", cookieAuthToken);
    if (!cookieAuthToken) {
      return guestSession;
    }

    const result = await fetch(getRestApiUrl("/tps/v1/auth/validate-token"), {
      method: "post",
      headers: {
        Authorization: "Bearer " + cookieAuthToken,
      },
    });

    // console.log("result.ok:", result.ok);

    if (result.ok) {
      const { token: authToken, user: user } = await (<
        Promise<{
          token: string;
          user: any;
        }>
      >result.json());

      // console.error("set session isLoaded on ok");
      // console.log("authToken:", authToken);
      // console.log("user:", user);

      if (authToken) {
        return {
          token: { timestamp: Date.now(), authToken, refreshToken: null },
          user,
          isLoaded: true,
        } as ISessionState;
      }
    }
  } catch (error) {
    console.error("authorizeSessionSSR exception:", error);
  }

  return guestSession;
}

export async function requestTouchVisitorSession() {
  // console.log("touchVisitorSession...");

  try {
    let url = new URL(getRestApiUrl("/tps/v1/visitor-session/touch"));

    const existingSid = Cookies.get(C.TEPLO_COOKIE.SID.name);
    // console.log("existingSid:", existingSid);
    if (existingSid) {
      url.search = new URLSearchParams({ "tps-vsid": existingSid }).toString();
    }

    const result = await utils.tokenFetch(url);

    if (result.ok) {
      try {
        const newSid = await (<Promise<string>>result.json());

        // console.log("newSid:", newSid);
        if (!existingSid && newSid) {
          Cookies.set(C.TEPLO_COOKIE.SID.name, newSid);
        }
      } catch (error) {}
    }
  } catch (error) {
    console.error("session tracking failed");
    console.error(error);
  }
}

const sessionModel: ISessionModel = {
  ...sessionState,
  ...sessionActions,
  ...sessionThunks,
};

export default sessionModel;
