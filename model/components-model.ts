import { IComponentsModel, IComponentsState } from "./model.typing";
import homePageModel from "./components/pages/home-page-model";
import aboutPageModel from "./components/pages/about-page-model";
import dashboardPageModel from "./components/pages/dashboard-page-model";
import teamModel from "./components/pages/team-page-model";
import breadCrumbsModel from "./components/breadcrumbs-model";
import catalogPageModel from "./components/pages/catalog-page-model";
import trackPageModel from "./components/pages/track-page-model";
import coursePageModel from "./components/pages/course-page-model";
import blockPageModel from "./components/pages/block-page-model";
import profilePageModel from "./components/pages/profile-page-model";
import profileEditPageModel from "./components/pages/profile-edit-page-model";
import notificationsModel from "./member/notifications";

const componentsState: IComponentsState = {
  homePage: homePageModel,
  aboutPage: aboutPageModel,
  dashboardPage: dashboardPageModel,
  catalogPage: catalogPageModel,
  teamPage: teamModel,
  breadCrumbs: breadCrumbsModel,
  trackPage: trackPageModel,
  coursePage: coursePageModel,
  blockPage: blockPageModel,
  profilePage: profilePageModel,
  profileEditPage: profileEditPageModel,
  notifications: notificationsModel,
};

export const componentList = Object.keys(componentsState) as Array<
  keyof IComponentsState
>;

const componentModel: IComponentsModel = {
  ...componentsState,
};

export default componentModel;
