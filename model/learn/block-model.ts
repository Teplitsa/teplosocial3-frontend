import { action, thunk } from "easy-peasy";
import * as _ from "lodash";
import * as store from "store";
import * as C from "../../const";
import { IBlockModel, IBlockState, IBlockActions, IBlockThunks, IStoreModel } from "../model.typing";
import { learnPostInitialState } from "../base/learn-post-model";
import * as utils from "../../utilities/utilities";
import * as guestPassingState from "./guest-passing-state";

export const blockState: IBlockState = {
  ..._.cloneDeep(learnPostInitialState),
  contentType: "text",
  isFinalInModule: false,
  courseSlug: "",
  moduleSlug: "",
  nextBlockSlug: "",
  nextUncompletedBlockSlug: "",
  trackSlug: "",
  taskAvailableFields: [],
  taskDataFields: {},
  uploadAssignmentNonce: "",
  isTaskUploaded: false,
  uploadedTask: null,
  isCompletedByAdaptest: false,
  isAvailableForGuest: false,
};

export const blockActions: IBlockActions = {
  initializeState: action((prevState) => {
    Object.assign(prevState, blockState);
  }),
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState);
  }),
  setIsStarted: action((state, isStarted) => {
    state.isStarted = isStarted
  }),
  setIsCompleted: action((state, isCompleted) => {
    state.isCompleted = isCompleted
  }),
  setTaskDataField: action((state, payload) => {
    if(!state.taskDataFields) {
      state.taskDataFields = {};
    }
    Object.assign(state.taskDataFields, payload);
  }),
  setIsTaskUploaded: action((state, payload) => {
    state.isTaskUploaded = payload
  }),
};

export const blockThunks: IBlockThunks = {
  completeBlockByUser: thunk(
    async (actions, {block, user, doneCallback}) => {
      let error = "";
      let data = [];

      try {
        let url = new URL(utils.getRestApiUrl(`/tps/v1/blocks/${block.slug}/complete`));

        const response = await utils.tokenFetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
        });

        if(!response.ok) {
          ({ message: error } = await response.json());
        } else {
          data = await response.json();
          actions.setIsStarted(true);
          actions.setIsCompleted(true);
          doneCallback(data);
          return
        }

      } catch (error) {
        console.error(error);
        error = "Ошибка!";
      }

      doneCallback({
        nextBlockSlug: "",
        completedTrackSlug: "",
        completedCourseSlug: "",
      });
    }
  ),
  completeBlockByGuest: thunk(
    async (actions, {block, module, doneCallback}) => {
      try {
          actions.setIsStarted(true);
          actions.setIsCompleted(true);
          
          const existingModulesPassingState = store.get(C.TEPLO_LOCAL_STORAGE.MODULE_PASSING_STATE.name);
          store.set(C.TEPLO_LOCAL_STORAGE.MODULE_PASSING_STATE.name, {
            ...existingModulesPassingState, 
            [module.id]: [..._.get(existingModulesPassingState, module.id, []), block.id],
          });

          doneCallback({
            nextBlockSlug: block.nextBlockSlug,
            completedTrackSlug: "",
            completedCourseSlug: "",
          });
          return
      } catch (error) {
        console.error(error);
        error = "Ошибка!";
      }

      doneCallback({
        nextBlockSlug: "",
        completedTrackSlug: "",
        completedCourseSlug: "",
      });
    }
  ),
  setIsBlockCompletedByGuest: thunk(
    async (actions, {block, module}) => {
      if(guestPassingState.isBlockCompletedByGuest(block, module)) {
        actions.setIsStarted(true);
        actions.setIsCompleted(true);
      }
    }
  ),
  uploadUserAssignmentRequest: thunk(
    async (
      actions,
      { block, module, file, url, text, doneCallback },
      { getStoreState }
    ) => {
      const formData = new FormData();
      formData.append( 'uploadfiles[]', file ?? null );
      formData.append( 'uploadfile', block.uploadAssignmentNonce );
      formData.append( 'post', String(block.id) );
      formData.append( 'course_id', String(module.id) );
      formData.append( 'assignment_url', url ?? "" );
      formData.append( 'assignment_text', text ?? "" );
      
      try {
        const result = await utils.tokenFetch(utils.getRestApiUrl("/tps/v1/assignments/submit"), {
          method: "post",
          body: formData,
        });

        if (result.ok) {
          // console.log("assignment updated ok");
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
          doneCallback({error: "При загрузке задания произошла ошибка!"});
        }

      } catch (error) {
        doneCallback({error: "При загрузке задания произошла ошибка!"});
        console.error(error);
      }
    }
  ),  
};

export async function requestBlockListByModule(moduleId) {
  let error = "";
  let data = [];

  try {
    let url = new URL(utils.getRestApiUrl(`/ldlms/v1/sfwd-lessons`));
    url.search = new URLSearchParams({
      course: String(moduleId),
      per_page: String(100),
      orderby: "menu_order",
    }).toString();

    const response = await utils.tokenFetch(url);

    if(!response.ok) {
      ({ message: error } = await response.json());
    } else {
      data = await response.json();
    }
  } catch (error) {
    console.error(error);
    error = "Ошибка!";
  }

  // console.log("data:", data);
  return {error, data};
}

export async function requestSiblingListByBlock(slug) {
  let error = "";
  let data = [];

  try {
    let url = new URL(utils.getRestApiUrl(`/tps/v1/blocks/sibling-list-by-block/${slug}`));
    url.search = new URLSearchParams({
      per_page: String(100),
      orderby: "menu_order",
    }).toString();    

    const response = await utils.tokenFetch(url);

    if(!response.ok) {
      ({ message: error } = await response.json());
    } else {
      data = await response.json();
    }
  } catch (error) {
    console.error(error);
    error = "Ошибка!";
  }

  // console.log("data:", data);
  return {error, data};
}

export async function requestBlock(slug, options={}) {
  let error = "";
  let data = {};

  try {
    let url = new URL(utils.getRestApiUrl(`/wp/v2/sfwd-lessons`));
    url.search = new URLSearchParams({"slug[]": slug}).toString();

    const response = await utils.tokenFetch(url, options);

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

  // console.log("data:", data);
  return {error, data: data as IBlockState};
}

const blockModel: IBlockModel = { ...blockState, ...blockActions, ...blockThunks };

export default blockModel;
