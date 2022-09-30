/* eslint-disable no-unused-vars */
import { MutableRefObject } from "react";
import { Action, ActionOn, Thunk, ThunkOn, Computed } from "easy-peasy";
import { ICoreBlock } from "./gutenberg/gutenberg.typing";
import { BSONType } from "mongodb";

/**
 * General types
 */
export interface IWpText {
  rendered: string;
  protected?: boolean;
}

/**
 * Store
 */

export interface IStoreModel {
  app: IAppState;
  session: ISessionModel;
  page?: IPageState;
  components: IComponentsState;
}

/**
 * Components
 */

export type IComponentsModel = IComponentsState;

export interface IComponentsState {
  page?: IPageModel;
  homePage?: IHomePageModel;
  aboutPage?: IAboutPageModel;
  dashboardPage?: IDashboardPageModel;
  catalogPage?: ICatalogPageModel;
  teamPage?: ITeamPageModel;
  breadCrumbs?: IBreadCrumbsModel;
  trackPage?: ITrackPageModel;
  coursePage?: ICoursePageModel;
  blockPage?: IBlockPageModel;
  profilePage?: IProfilePageModel;
  profileEditPage?: IProfileEditPageModel;
  notifications?: INotificationsModel;
}

/**
 * App
 */

export interface IAppModel extends IAppState, IAppActions {}

export interface IAppState {
  componentsLoaded?: IAppComponentsLoaded;
}

export interface IAppComponentsLoaded {
  [index: string]: Array<{ at: string; entrypoint: string }>;
}

export interface IAppActions {
  setState: Action<IAppModel, IAppState>;
}

/**
 * Session
 */

export interface ISessionModel
  extends ISessionState,
    ISessionActions,
    ISessionThunks {}

export interface ISessionState {
  isLoaded: boolean;
  token: ISessionToken;
  user: ISessionUserState;
  validToken?: Computed<ISessionModel, string>;
  isLoggedIn?: Computed<ISessionModel, boolean>;
  isAdmin?: Computed<ISessionModel, boolean>;
  mustSkipModuleCompletedByAdaptestModal?: {};
}

export interface ISessionToken {
  timestamp: number;
  authToken: string;
  refreshToken: string;
}

export interface IUserState {
  id: number;
  slug: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  avatarFile: any;
  points: number;
  isAdmin?: boolean;
}

export interface ISessionUserState extends IUserState {
  socialLinks: Array<string>;
  fullName: string;
  city: string;
}

export interface ISessionActions {
  setState: Action<ISessionModel, ISessionState>;
  setIsLoaded: Action<ISessionState, boolean>;
  setUserAvatar: Action<ISessionState, any>;
  setUserAvatarFile: Action<ISessionState, any>;
  setMustSkipModuleCompletedByAdaptestModal: Action<ISessionState, number>;
}

export interface ISessionThunks {
  register: Thunk<
    ISessionActions,
    {
      formData: {
        first_name: string;
        last_name: string;
        email: string;
        password: string;
      };
      successCallbackFn: () => void;
      errorCallbackFn: (message: string) => void;
    }
  >;
  login: Thunk<
    ISessionActions,
    {
      formData: {
        login: string;
        password: string;
      };
      successCallbackFn: () => void;
      errorCallbackFn: (message: string) => void;
    }
  >;
  logout: Thunk<ISessionActions>;
  retrievePassword: Thunk<
    ISessionActions,
    {
      formData: {
        email: string;
      };
      successCallbackFn: () => void;
      errorCallbackFn: (message: string) => void;
    }
  >;
  changePassword: Thunk<
    ISessionActions,
    {
      formData: {
        pass1: string;
        pass2: string;
        rp_key: string;
      };
      successCallbackFn: () => void;
      errorCallbackFn: (message: string) => void;
    }
  >;
  changePasswordByAuthorizedUser: Thunk<
    ISessionActions,
    {
      formData: {
        old_password: string;
        new_password: string;
        new_password_repeat: string;
      };
      successCallbackFn: () => void;
      errorCallbackFn: (message: string) => void;
    }
  >;
  authorizeSession: Thunk<ISessionActions>;
}

/**
 * Cacheable
 */

export interface ICacheable {
  _id: BSONType | string;
  externalId?: number;
}

/**
 * Profile
 */
export interface IProfileModel
  extends IProfileState,
    IProfileActions,
    IProfileThunks {}

export type ISocialLinkType = "facebook" | "vk" | "telegram" | "";
export type ISocailLink = {
  url: string;
  type: ISocialLinkType;
  mustHide: boolean;
};

export interface IProfileState extends IUserState {
  city: string;
  description: string;
  socialLinks: Array<ISocailLink>;
  isEmptyProfile: boolean;
  fileUploadNonce?: string;
}

export interface IProfileActions {
  initializeState: Action<IProfileState>;
  setState: Action<IProfileState, IProfileState>;
  setAvatar: Action<IProfileState, string>;
  setAvatarFile: Action<IProfileState, any>;
  fullName: Computed<IProfileState, any>;
}

export interface IProfileThunks {
  uploadUserAvatarRequest: Thunk<
    IProfileActions,
    {
      file: File;
      profile: IProfileState;
      doneCallback: (params?: IDoneCallbackParams) => void;
      failCallback?: (params?: IDoneCallbackParams) => void;
    }
  >;
  updateProfileRequest: Thunk<
    IProfileActions,
    {
      profile: IProfileState;
      formData: any;
      doneCallback: (params?: IDoneCallbackParams) => void;
    }
  >;
  loadProfileRequest: Thunk<
    IProfileActions,
    {
      profile: IProfileState;
      doneCallback: (params?: IDoneCallbackParams) => void;
    }
  >;
}

/**
 * Post
 */
export interface IPostState {
  id?: number;
  slug?: string;
  title?: IWpText;
  content?: IWpText;
  excerpt?: IWpText;
  featured_media?: any;
  date_gmt?: string;
  date?: string;
  yoast_head?: string;
  blocks?: Array<ICoreBlock>;
}

export interface ILearnPostState extends IPostState {
  duration: number;
  points?: number;
  isStarted?: boolean;
  isCompleted?: boolean;
}

export interface ILearnPostActions {
  setIsStarted: Action<ILearnPostState, boolean>;
  setIsCompleted: Action<ILearnPostState, boolean>;
}

/**
 * Page
 */

export interface IPageModel extends IPageState, IPageActions {}

export interface IPageState extends IPostState {
  yoast_head_json?: IPageSEO;
  courseTags?: Array<ITagState>;
}

export interface IPageSEO {
  title: string;
  description?: string;
  robots: {
    index: string;
    follow: string;
    "max-snippet": string;
    "max-image-preview": string;
    "max-video-preview": string;
  };
  canonical: string;
  og_locale?: string;
  og_type?: string;
  og_title?: string;
  og_description?: string;
  og_url?: string;
  og_site_name?: string;
  article_publisher?: string;
  article_author?: string;
  article_published_time?: string;
  article_modified_time?: string;
  og_image?: Array<{
    width: number;
    height: number;
    url: string;
    path: string;
    size: string;
    id: string;
    alt: string;
    pixels: number;
    type: string;
  }>;
  twitter_card?: string;
  twitter_creator?: string;
  twitter_site?: string;
  twitter_misc?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  schema?: Array<object>;
}

export interface IPageSEOMeta {
  keywords?: string;
  description?: string;
}

export interface IPageActions {
  initializeState: Action<IPageModel>;
  setState: Action<IPageModel, IPageState>;
  setCourseTags: Action<IPageModel, Array<ITagState>>;
}

export interface IPageActions {
  initializeState: Action<IPageModel>;
  setState: Action<IPageModel, IPageState>;
}

export interface IPageThunks {
  requestPage: Thunk<IPageActions>;
}

/**
 * Tag
 */

export type TagId = number;

export interface ITagState extends ICacheable {
  slug: string;
  name: string;
  description?: string;
  count: number;
}

/**
 * Helpers
 */

export interface IAnyState {
  [x: string]: any;
}

export interface IFetchResult extends IAnyState {
  status: string;
  message: string;
}

export interface IDoneCallbackParams extends IAnyState {
  error?: string;
}

export interface IRestApiResponse {
  code: string;
  data: {
    status: number;
    [x: string]: any;
  };
  message: string;
}

/**
 * Stats
 */

export interface IStats {
  user: { total: number };
  certificate: { total: number };
  course: { total: number };
  track: { total: number };
}

/**
 * Certificate
 */

export interface ICertificate {
  certificateId: number;
  courseName: string;
  userId?: number;
  dateTime?: string;
}

/**
 * Advantage
 */

export interface IAdvantage extends ICacheable {
  title: string;
  excerpt: string;
  thumbnail: string;
}

/**
 * Testimonial
 */

export interface ITestimonial extends ICacheable {
  title: string;
  excerpt: string;
  content: string;
  thumbnail: string;
}

export interface ICourseCard extends ICacheable {
  slug: string;
  title: string;
  thumbnail?: string;
  smallThumbnail?: string;
  duration: number;
  points?: number;
  teaser: string;
  nextBlockSlug?: string;
  nextBlockTitle?: string;
  url?: string;
  mediaId?: string;
  blockUrl?: string;
  blockTitle?: string;
  btnText?: string;
  template?: "default" | "small-thumbnail";
  isCompleted?: boolean;
  progress?: string;
  lastActionTime?: number;
  tags?: Array<ITagState>;
  certificates?: {
    horizontal?: number;
    vertical?: number;
  };
  trackId?: number;
  trackSlug?: string;
  trackTitle?: string;
}

/**
 * HomePage
 */
export interface IHomePageModel
  extends IHomePageState,
    IHomePageActions,
    IHomePageThunks {}

export interface IHomePageState extends IPageState {
  advantages?: Array<IAdvantage>;
  courseFilter: {
    tags: Array<ITagState>;
  };
  courses: Array<ICourseCard>;
  courseTotal: number;
  tracks: Array<ICourseCard>;
  trackTotal: number;
  stats?: IStats;
  testimonials?: Array<ITestimonial>;
}

export interface IHomePageActions {
  initializeState: Action<IHomePageModel>;
  setState: Action<IHomePageModel, IHomePageState>;
  setCourseList: Action<IHomePageModel, Array<ICourseCard>>;
  setTrackList: Action<IHomePageModel, Array<ICourseCard>>;
}

export interface IHomePageThunks {
  requestPage: Thunk<IHomePageActions>;
}

/**
 * AboutPage
 */
export interface IAboutPageModel
  extends IAboutPageState,
    IAboutPageActions,
    IAboutPageThunks {}

export interface IAboutPageState extends IPageState {
  stats: IStats;
  tracks: Array<ICourseCard>;
}

export interface IAboutPageActions {
  initializeState: Action<IAboutPageModel>;
  setState: Action<IAboutPageModel, IAboutPageState>;
}

export interface IAboutPageThunks {}

/**
 * DashboardPage
 */
export interface IDashboardPageModel
  extends IDashboardPageState,
    IDashboardPageActions,
    IDashboardPageThunks {}

export interface IDashboardPageState {
  startedCourses: Array<ICourseCard>;
  certificates: Array<ICertificate>;
  courseTags: Array<ITagState>;
  completedCourseFilter: {
    searchPhrase: string;
    searchTooltips: {
      courses: Array<ICourseCard>;
    };
  };
  completedCourses: Array<ICourseCard>;
  completedCourseTotal: number;
  completedCourseSkip: number;
  isCompletedCourseListLoading: boolean;
}

export interface IDashboardPageActions {
  initializeState: Action<IDashboardPageModel>;
  setState: Action<IDashboardPageModel, IDashboardPageState>;
  setCompletedCourseList: Action<IDashboardPageModel, Array<ICourseCard>>;
  setCompletedCourseListLoading: Action<IDashboardPageModel, boolean>;
  updateCompletedCourseList: Action<IDashboardPageModel, Array<ICourseCard>>;
  setSearchPhrase: Action<IDashboardPageModel, string>;
  setCompletedCourseTotal: Action<IDashboardPageModel, number>;
  setCompletedCourseSkip: Action<IDashboardPageModel, number>;
  setSearchTooltipsForCourse: Action<IDashboardPageModel, Array<ICourseCard>>;
}

export interface IDashboardPageThunks {
  completedCourseListRequest: Thunk<
    IDashboardPageActions,
    { callback?: () => void }
  >;
  trackCoursesListRequest: Thunk<
    IDashboardPageActions,
    { callback?: () => void; track_id: string }
  >;
  completedCourseTooltipsRequest: Thunk<IDashboardPageActions, undefined>;
}

/**
 * CatalogPage
 */
export interface ICatalogPageModel
  extends ICatalogPageState,
    ICatalogPageActions,
    ICatalogPageThunks {}

export interface ICatalogPageState {
  courseFilter: {
    searchPhrase: string;
    tags: Array<ITagState>;
    activeTags: Array<TagId>;
    searchTooltips: {
      courses: Array<ICourseCard>;
      tracks: Array<ICourseCard>;
    };
  };
  courses: Array<ICourseCard>;
  tracks: Array<ICourseCard>;
  courseTotal: number;
  trackTotal: number;
  courseSkip: number;
  trackSkip: number;
  isCourseListLoading: boolean;
  isTrackListLoading: boolean;
}

export interface ICatalogPageActions {
  initializeState: Action<ICatalogPageModel>;
  setState: Action<ICatalogPageModel, ICatalogPageState>;
  setCourseList: Action<ICatalogPageModel, Array<ICourseCard>>;
  setTrackList: Action<ICatalogPageModel, Array<ICourseCard>>;
  setCourseListLoading: Action<ICatalogPageModel, boolean>;
  setTrackListLoading: Action<ICatalogPageModel, boolean>;
  updateCourseList: Action<ICatalogPageModel, Array<ICourseCard>>;
  updateTrackList: Action<ICatalogPageModel, Array<ICourseCard>>;
  setSearchPhrase: Action<ICatalogPageModel, string>;
  setSearchTooltipsForCourse: Action<ICatalogPageModel, Array<ICourseCard>>;
  setSearchTooltipsForTrack: Action<ICatalogPageModel, Array<ICourseCard>>;
  setActiveTags: Action<ICatalogPageModel, TagId>;
  setCourseTotal: Action<ICatalogPageModel, number>;
  setTrackTotal: Action<ICatalogPageModel, number>;
  setCourseSkip: Action<ICatalogPageModel, number>;
  setTrackSkip: Action<ICatalogPageModel, number>;
}

export interface ICatalogPageThunks {
  requestPage: Thunk<ICatalogPageActions>;
  courseListRequest: Thunk<ICatalogPageActions, { callback?: () => void }>;
  trackListRequest: Thunk<ICatalogPageActions, { callback?: () => void }>;
  courseTooltipstRequest: Thunk<ICatalogPageActions, undefined>;
  trackTooltipstRequest: Thunk<ICatalogPageActions, undefined>;
}

/**
 * BreadCrumbs
 */
export interface IBreadCrumbsModel
  extends IBreadCrumbsState,
    IBreadCrumbsActions {}

export interface IBreadCrumbsState {
  crumbs: Array<{ title: string; url?: string }>;
}

export interface IBreadCrumbsActions {
  initializeState: Action<IBreadCrumbsState>;
  setState: Action<IBreadCrumbsModel, IBreadCrumbsState>;
  setCrumbs: Action<IBreadCrumbsModel, Array<{ title: string; url?: string }>>;
}

/**
 * Project reviews
 */
export interface ITestimonialsModel
  extends ITestimonialsState,
    ITestimonialsActions,
    ITestimonialsThunks {}

export interface ITestimonialsItem {
  mediaId?: string;
  text: string;
  name: string;
  position?: string;
}

export interface ITestimonialsState {
  items: Array<IPostState>;
}

export interface ITestimonialsActions {
  initializeState: Action<ITestimonialsModel>;
  setState: Action<ITestimonialsModel, ITestimonialsState>;
}

export interface ITestimonialsThunks {
  requestTestimonials: Thunk<ITestimonialsActions>;
}

/**
 * TeamPage
 */
export interface ITeamPageModel
  extends ITeamPageState,
    ITeamPageActions,
    ITeamPageThunks {}

export interface ITeamPageState extends IPageState {
  teamMembers: ITeamMembersState;
}

export interface ITeamPageActions {
  initializeState: Action<ITeamPageModel>;
  setState: Action<ITeamPageModel, ITeamPageState>;
}

export interface ITeamPageThunks {
  requestPage: Thunk<ITeamPageActions>;
}

/**
 * Team members
 */
export interface ITeamMembersModel
  extends ITeamMembersState,
    ITeamMembersActions,
    ITeamMembersThunks {}

export interface ITeamMemberState extends IPostState {
  avatar?: string;
}

export interface ITeamMembersState {
  items: Array<ITeamMemberState>;
}

export interface ITeamMembersActions {
  initializeState: Action<ITeamMembersModel>;
  setState: Action<ITeamMembersModel, ITeamMembersState>;
}

export interface ITeamMembersThunks {
  requestTeamMembers: Thunk<ITeamMembersActions>;
}

/**
 * TrackPage
 */
export interface ITrackPageModel
  extends ITrackPageState,
    ITrackPageActions,
    ITrackPageThunks {}

export interface ITrackPageState {
  track: ITrackModel;
  courseList: Array<ICourseState>;
  courseListModuleList: {
    [key: number]: Array<IModuleState>;
  };
}

export interface ITrackPageActions {
  initializeState: Action<ITrackPageState>;
  setState: Action<ITrackPageState, ITrackPageState>;
  setCourseModuleList: Action<
    ITrackPageState,
    { course: ICourseState; moduleList: Array<IModuleState> }
  >;
}

export interface ITrackPageThunks {
  requestModuleListByCourse: Thunk<ITrackPageActions, { course: ICourseState }>;
}

/**
 * CoursePage
 */
export interface ICoursePageModel
  extends ICoursePageState,
    ICoursePageActions,
    ICoursePageThunks {}

export interface ICoursePageState {
  course: ICourseModel;
  moduleList: Array<IModuleState>;
  moduleListBlockList: {
    [key: number]: Array<IBlockState>;
  };
}

export interface ICoursePageActions {
  initializeState: Action<ICoursePageState>;
  setState: Action<ICoursePageState, ICoursePageState>;
  setModuleBlockList: Action<
    ICoursePageState,
    {
      moduleId: number;
      blockList: Array<IBlockState>;
    }
  >;
}

export interface ICoursePageThunks {
  loadBlockListByModule: Thunk<
    ICoursePageActions,
    {
      moduleId: number;
      doneCallback: (moduleId: number) => void;
    }
  >;
}

/**
 * BlockPage
 */
export interface IBlockPageModel
  extends IBlockPageState,
    IBlockPageActions,
    IBlockPageThunks {}

export interface IBlockPageState {
  block: IBlockModel;
  module: IModuleModel;
  course: ICourseModel;
  siblingBlockList: Array<IBlockState>;
  courseModuleList: Array<IModuleState>;
  isCourseIndexOpen: boolean;
  quiz?: IQuizModel;
}

export interface IBlockPageActions {
  initializeState: Action<IBlockPageState>;
  setState: Action<IBlockPageState, IBlockPageState>;
  setSiblingBlockList: Action<IBlockPageState, Array<IBlockState>>;
  setCourseModuleList: Action<IBlockPageState, Array<IModuleState>>;
  setIsCourseIndexOpen: Action<IBlockPageState, boolean>;
}

export interface IBlockPageThunks {
  requestCourseModules: Thunk<IBlockPageActions, ICourseState>;
  requestBlockSiblings: Thunk<IBlockPageActions, IBlockState>;
}

/**
 * ProfilePage
 */
export interface IProfilePageModel
  extends IProfilePageState,
    IProfilePageActions,
    IProfilePageThunks {}

export interface IProfilePageState {
  profile: IProfileModel;
}

export interface IProfilePageActions {
  initializeState: Action<IProfilePageModel>;
  setState: Action<IProfilePageModel, IProfilePageState>;
}

export interface IProfilePageThunks {}

/**
 * ProfileEditPage
 */
export interface IProfileEditPageModel
  extends IProfileEditPageState,
    IProfileEditPageActions,
    IProfileEditPageThunks {}

export interface IProfileEditPageState {
  profile: IProfileModel;
}

export interface IProfileEditPageActions {
  initializeState: Action<IProfileEditPageModel>;
  setState: Action<IProfileEditPageModel, IProfileEditPageState>;
}

export interface IProfileEditPageThunks {}

/**
 * Track
 */
export interface ITrackModel extends ITrackState, ITrackActions, ITrackThunks {}

export interface ITrackSettings {
  description: string;
  description_common: string;
  description_lead: string;
}

export interface ITrackState extends ILearnPostState, ICacheable {
  teaser: string;
  thumbnail?: string;
  numberOfBlocks: number;
  numberOfCompletedBlocks: number;
  trackSettings: ITrackSettings;
}

export interface ITrackActions extends ILearnPostActions {
  initializeState: Action<ITrackState>;
  setState: Action<ITrackState, ITrackState>;
}

export interface ITrackThunks {
  startTrackByUser: Thunk<
    ICourseActions,
    {
      track: ITrackState;
      user: ISessionUserState;
      doneCallback: (params?: any) => void;
    }
  >;
}

/**
 * Course
 */
export interface ICourseModel
  extends ICourseState,
    ICourseActions,
    ICourseThunks {}

export interface ICourseReview {
  rating: number;
  text: string;
}

export interface ICourseTeacher {
  id: number;
  name: string;
  resume: string;
  avatar: string;
}

export interface ICourseTestimonial {
  id: number;
  name: string;
  position: string;
  text: string;
  avatar: string;
}

export interface ICourseState extends ILearnPostState, ICacheable {
  track?: {
    title: string;
    slug: string;
  };
  teaser?: string;
  description?: string;
  suitableFor: string;
  learningResult: string;
  thumbnail?: string;
  numberOfBlocks?: number;
  numberOfCompletedBlocks?: number;
  nextBlockSlug?: string;
  nextBlockTitle?: string;
  review?: any;
  adaptestSlug?: string;
  isAdaptestCompleted?: boolean;
  moduleListByAdaptest?: Array<IModuleState>;
  moduleListCompletedByAdaptest?: Array<IModuleState>;
  teacherList?: Array<ICourseTeacher>;
  testimonialList?: Array<ICourseTestimonial>;
}

export interface ICourseActions extends ILearnPostActions {
  initializeState: Action<ICourseState>;
  setState: Action<ICourseState, ICourseState>;
  setReview: Action<ICourseState, any>;
  setModuleListByAdaptest: Action<ICourseState, Array<IModuleState>>;
  setModuleListCompletedByAdaptest: Action<ICourseState, Array<IModuleState>>;
  setIsAdaptestCompleted: Action<ICourseState, boolean>;
}

export interface ICourseThunks {
  startCourseByUser: Thunk<
    ICourseActions,
    {
      course: ICourseState;
      user: ISessionUserState;
      doneCallback: (params?: any) => void;
    }
  >;
  submitCourseReview: Thunk<
    ICourseActions,
    {
      course: ICourseState;
      user: ISessionUserState;
      courseReview: ICourseReview;
      doneCallback: (params?: any) => void;
    }
  >;
  loadModuleListByCourseCompletedByAdaptest: Thunk<
    ICourseActions,
    {
      course: ICourseState;
      doneCallback?: (params?: any) => void;
    }
  >;
}

/**
 * Module
 */
export interface IModuleModel
  extends IModuleState,
    IModuleActions,
    IModuleThunks {}

export interface IModuleState extends ILearnPostState {
  courseSlug: string;
  numberOfBlocks: number;
  numberOfCompletedBlocks: number;
  isCompletedByAdaptest?: boolean;
}

export interface IModuleActions extends ILearnPostActions {
  initializeState: Action<IModuleState>;
  setState: Action<IModuleState, IModuleState>;
}

export interface IModuleThunks {}

/**
 * Block
 */
export type IBlockContentType =
  | "text"
  | "video"
  | "test"
  | "task"
  | "adaptest-intro";
export type IBlockTaskFieldType = "text" | "url" | "file";
export interface IBlockModel extends IBlockState, IBlockActions, IBlockThunks {}

export interface IBlockState extends ILearnPostState {
  contentType: IBlockContentType;
  taskAvailableFields: Array<IBlockTaskFieldType>;
  taskDataFields: { [key: string]: string | File };
  isFinalInModule: boolean;
  trackSlug: string;
  courseSlug: string;
  moduleSlug: string;
  nextBlockSlug: string;
  nextUncompletedBlockSlug: string;
  uploadAssignmentNonce?: string;
  isTaskUploaded?: boolean;
  uploadedTask?: any;
  isCompletedByAdaptest?: boolean;
  isAvailableForGuest: boolean;
}

export interface IBlockActions extends ILearnPostActions {
  initializeState: Action<IBlockState>;
  setState: Action<IBlockState, IBlockState>;
  setTaskDataField: Action<IBlockState, { [key: string]: string }>;
  setIsTaskUploaded: Action<IBlockState, boolean>;
}

export interface IBlockThunks {
  completeBlockByUser: Thunk<
    IBlockActions,
    {
      block: IBlockState;
      user: ISessionUserState;
      doneCallback: (params?: any) => void;
    }
  >;
  completeBlockByGuest: Thunk<
    IBlockActions,
    {
      block: IBlockState;
      module: IModuleState;
      doneCallback: (params?: any) => void;
    }
  >;
  setIsBlockCompletedByGuest: Thunk<
    IBlockActions,
    {
      block: IBlockState;
      module: IModuleState;
    }
  >;
  uploadUserAssignmentRequest: Thunk<
    IBlockActions,
    {
      block: IBlockState;
      module: IModuleState;
      file?: File;
      url?: string;
      text?: string;
      doneCallback: (params?: any) => void;
    }
  >;
}

/**
 * Quiz
 */
export type IQuizQuestionType =
  | "single"
  | "multiple"
  | "matrix_sort_answer"
  | "essay";
export type IQuizCheckedAnswer = {
  c: boolean;
  p: number;
  s: object;
  e: {
    type: IQuizQuestionType;
    r: Array<boolean | string>;
    c: Array<number | string>;
    AnswerMessage: string;
    possiblePoints: number;
  };
  a_nonce: string;
  p_nonce: string;
};
export interface IQuizModel extends IQuizState, IQuizActions, IQuizThunks {}

export type QuizType = "normal" | "adaptest" | "quiz" | "checklist";

export type QuizTypeChecklistSettings = {
  interval_title: string;
  points_needed: string;
  description: string;
};

export interface IQuizState extends IPostState {
  quizType: QuizType;
  quizTypeRelatedSettings: Array<QuizTypeChecklistSettings>;
  activeQuestionIndex: number;
  questions: Array<IQuestionState>;
  userAnswers: {
    [key: number]: Array<String>;
  };
  answeredQuestions: Array<number>;
  userAnswersResult: {
    [key: number]: boolean;
  };
  nonce?: string;
  quizProId: number;
  checkedAnswers?: {
    [key: number]: IQuizCheckedAnswer;
  };
  startTimestamp: number;
  endTimestamp: number;
  passingpercentage: number;
  isAdaptest?: boolean;
  isAdaptestPassedRepeatedly?: boolean;
  duration?: number;
  courseSlug?: string;
}

export interface IQuizActions {
  initializeState: Action<IQuizState>;
  initPassingState: Action<IQuizState>;
  activeQuestion: Computed<IQuizState, any>;
  setState: Action<IQuizState, IQuizState>;
  addUserAnswer: Action<
    IQuizState,
    { questionId: number; answerValue: string }
  >;
  setUserAnswer: Action<
    IQuizState,
    { questionId: number; answerValue: string }
  >;
  setUserAnswerMatrix: Action<
    IQuizState,
    { questionId: number; answerValue: any }
  >;
  deleteUserAnswer: Action<
    IQuizState,
    { questionId: number; answerValue: string }
  >;
  setActiveQuestionIndex: Action<IQuizState, number>;
  addAnsweredQuestion: Action<IQuizState, number>;
  setCheckedAnswers: Action<
    IQuizState,
    {
      [key: number]: IQuizCheckedAnswer;
    }
  >;
  setUserAnswersResult: Action<
    IQuizState,
    {
      [key: number]: boolean;
    }
  >;
  isCompleted: Computed<IQuizState, any>;
  wrongAnswersCount: Computed<IQuizState, any>;
  answersToBeGradedCount: Computed<IQuizState, any>;
  isPassed: Computed<IQuizState, any>;
}

export interface IQuizThunks {
  startQuizByUser: Thunk<
    IQuizActions,
    {
      quiz: IQuizState;
      module: IModuleState;
      user: ISessionUserState;
      doneCallback: (params?: any) => void;
    }
  >;
  checkQuizUserAnswers: Thunk<
    IQuizActions,
    {
      quiz: IQuizState;
      module: IModuleState;
      user: ISessionUserState;
      doneCallback: (params?: any) => void;
    }
  >;
  completeQuizByUser: Thunk<
    IQuizActions,
    {
      quiz: IQuizState;
      block: IBlockState;
      module: IModuleState;
      user: ISessionUserState;
      doneCallback: (params?: any) => void;
    }
  >;
  requestBySlug: Thunk<IPageActions, { slug: string }>;
}

export interface IQuestionState {
  id: number;
  quizId: number;
  sort: number;
  title: string;
  question: string;
  correctMsg: string;
  incorrectMsg: string;
  answerType: IQuizQuestionType;
  answerData: Array<IAnswerState>;
  startTimestamp: number;
  endTimestamp: number;
  uploadNonce?: string;
}

export interface IAnswerState {
  answer: string;
  correct: boolean;
  selected: boolean;
  sortString?: string;
  datapos?: string;
}

/**
 * Notifications
 */

export type INotificationStatusNames =
  | "created"
  | "delivered"
  | "read"
  | "deleted";

export interface INotification extends ICacheable {
  timestamp?: number;
  status?: INotificationStatusNames;
  text?: string;
}

export interface INotificationsModel
  extends INotificationsState,
    INotificationsActions,
    INotificationsThunks {}

export interface INotificationsState {
  list: Array<INotification>;
}

export interface INotificationsActions {
  initializeState: Action<INotificationsModel>;
  setState: Action<INotificationsModel, INotificationsState>;
  setNotificationList: Action<INotificationsModel, Array<INotification>>;
  addNotificationItem: Action<INotificationsModel, INotification>;
  updateNotificationItem: Action<INotificationsModel, INotification>;
}

export interface INotificationsThunks {
  notificationListRequest: Thunk<
    INotificationsActions,
    MutableRefObject<WebSocket>
  >;
  notificationItemChangeRequest: Thunk<INotificationsActions, INotification>;
}

export interface INotificationsWebSocketMessage extends IWebSocketMessage {
  target: INotification | Array<INotification>;
}

/**
 * WebSocket
 */

export interface IWebSocketMessage {
  operation: "get" | "insert" | "update";
  target: unknown;
}
