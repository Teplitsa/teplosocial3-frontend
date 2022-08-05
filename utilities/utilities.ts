import { format, formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import moment from "moment";
import * as _ from "lodash";
import Cookies from "js-cookie";
import SsrCookie from "ssr-cookie";
import { decode } from "html-entities";
import * as C from "../const";

export const getDeclension = ({
  count,
  caseOneItem,
  caseTwoThreeFourItems,
  restCases,
}: {
  count: number;
  caseOneItem: string;
  caseTwoThreeFourItems: string;
  restCases: string;
}): string => {
  const reviewsCountModulo =
    count < 10 ? count : Number([...Array.from(String(count))].pop());

  const reviewsCountModulo100 =
    count < 10
      ? count
      : Number([...Array.from(String(count))].slice(-2).join(""));

  if (reviewsCountModulo100 > 10 && reviewsCountModulo100 < 20) {
    return restCases;
  }

  if (reviewsCountModulo === 1) {
    return caseOneItem;
  }

  if ([2, 3, 4].includes(reviewsCountModulo)) {
    return caseTwoThreeFourItems;
  }

  return restCases;
};

export const escapeRegEx = (input: string) => {
  const source = typeof input === "string" ? input : "";

  return source.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"); // -#
};

export const convertObjectToClassName = (classNameMatrix: {
  [className: string]: boolean;
}): string =>
  Object.entries(classNameMatrix)
    .reduce(
      (activeClassList, [className, activityFlag]) =>
        (activityFlag && [...activeClassList, className]) || activeClassList,
      []
    )
    .join(" ");

export const convertClassNameToObject = (
  className: string
): {
  [className: string]: boolean;
} | null => {
  if (typeof className !== "string" || className.trim().length === 0)
    return null;

  return Object.fromEntries(
    new Map(
      className
        .trim()
        .split(" ")
        .map((className: string) => [className, true])
    )
  );
};

export const generateUniqueKey = ({
  base,
  prefix = "",
}: {
  base: string;
  prefix?: string;
}) => {
  return (
    (prefix ? `${prefix}-` : "") +
    Array.from(base).reduce(
      (result, char) =>
        (/[a-zа-я]/i.test(char) && result + char.charCodeAt(0)) || result,
      0
    )
  );
};

export const stripTags = (str = "") => str.replace(/<\/?[^>]+>/gi, "").trim();

export const capitalize = (str = "") =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const toCamelCase = (str = ""): string =>
  str.replace(/\W+(.)/g, (match, char) => char.toUpperCase());

export const getAjaxUrl = (action: string): string => {
  const url = new URL(process.env.AjaxUrl);
  url.searchParams.set("action", action);
  return url.toString();
};

export const getSiteUrl = (path: string): string => {
  const url = new URL(process.env.BaseUrl + path);
  return url.toString();
};

export const getLoginUrl = (): string => {
  const url = new URL(process.env.LoginUrl);
  return url.toString();
};

export const getRestApiUrl = (route: string): string => {
  const url = new URL(process.env.RestApiUrl + route);
  return url.toString();
};

export function showAjaxError(errorData) {
  if (errorData.message) {
    const el = document.createElement("div");
    el.innerHTML = errorData.message;
    console.error(el.textContent);
  } else {
    console.error("Ошибка!");
  }

  if (errorData.action) {
    console.error(errorData.action + " failed");
  }

  if (errorData.error) {
    console.error(errorData.error);
  }
}

export function decodeHtmlSpecialChars(textWithSpecialChars: string) {
  return decode(textWithSpecialChars, { level: "html5" });
}

export function decodeHtmlEntities(textWithEntities) {
  return textWithEntities.replace(/&#([0-9]+?);/gi, function (match, numStr) {
    var num = parseInt(numStr, 10);
    return String.fromCharCode(num);
  });
}

export function formDataToJSON(formData: FormData): string {
  const object = {};
  formData.forEach((value, key) => {
    // Reflect.has in favor of: object.hasOwnProperty(key)
    if (!Reflect.has(object, key)) {
      object[key] = value;
      return;
    }
    if (!Array.isArray(object[key])) {
      object[key] = [object[key]];
    }
    object[key].push(value);
  });
  return JSON.stringify(object);
}

export function JSONToFormData(json: { [name: string]: any }): FormData {
  const formData = new FormData();

  Object.entries(json).forEach(([name, value]) => {
    const valueType = typeof value;
    formData.append(
      name,
      valueType === "object" ? JSON.stringify(value) : value
    );
  });

  return formData;
}

export async function tokenFetch(url, options = {}) {
  // console.log("Cookie name:", C.TEPLO_COOKIE.AUTH_TOKEN.name);
  // console.log("Token:", Cookies.get(C.TEPLO_COOKIE.AUTH_TOKEN.name));

  let cookieSSR = null;
  if (_.get(options, "res", null) && _.get(options, "req", null)) {
    cookieSSR = new SsrCookie(
      _.get(options, "req", null),
      _.get(options, "res", null)
    );
  }

  const token =
    typeof window === "undefined" && cookieSSR
      ? cookieSSR.get(C.TEPLO_COOKIE.AUTH_TOKEN.name)
      : Cookies.get(C.TEPLO_COOKIE.AUTH_TOKEN.name);

  // console.log("token:", token);

  let requestOptions = { ...options };
  delete requestOptions["req"];
  delete requestOptions["res"];

  if (!_.isEmpty(_.get(options["req"], "cookies"))) {
    const cookie = _.get(options["req"], "cookies");
    _.set(
      requestOptions,
      "headers.Cookie",
      Object.keys(cookie)
        .map((key) => {
          return key + "=" + _.get(cookie, key, "");
        })
        .join("; ")
    );
  }

  _.set(requestOptions, "headers.Authorization", "Bearer " + token);

  // console.log("requestOptions:", requestOptions);

  return await fetch(url, requestOptions);
}
