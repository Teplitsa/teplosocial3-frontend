const gaEventsData = {};

/* General events */
gaEventsData["m_login"] = {
  ga_category: "Логин (переход)",
  ga_action: "Логин - Ссылка в меню",
};

gaEventsData["m_reg"] = {
  ga_category: "Регистрация (переход)",
  ga_action: "Регистрация - Ссылка в меню",
};

const pageTypeList = {
  reg: "Страница регистрации",
  login: "Страница входа",
  home: "Главная",
  default: "Неизвестный тип страницы",
};

function detectPageType(router, pageType = null) {
  if (!pageType) {
    if (router.pathname === "/") {
      pageType = "home";
    } else if (router.pathname.match(/\/auth\/registration\/?$/)) {
      pageType = "reg";
    } else if (router.pathname.match(/\/auth\/login\/?$/)) {
      pageType = "login";
    } else {
      pageType = "default";
    }
  }

  return pageTypeList[pageType];
}

export const regEvent = (triggerId, router): void => {
  // console.log("reg ga event triggerId:", triggerId);
  // console.log("router:", router);
  // console.log("ga:", window['ga']);

  if (typeof window["ga"] != "function") {
    return;
  }

  const itvGa = window["ga"];

  //to_do check for the correct value
  if (gaEventsData[triggerId]) {
    const pageType = detectPageType(router);

    //debug
    // console.log("ga_category:", gaEventsData[triggerId].ga_category);
    // console.log("ga_action:", gaEventsData[triggerId].ga_action);
    // console.log("pageType:", pageType);

    itvGa(
      "send",
      "event",
      gaEventsData[triggerId].ga_category,
      gaEventsData[triggerId].ga_action,
      pageType,
      1
    );
  }
};
