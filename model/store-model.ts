import appModel from "./app-model";
import sessionModel from "./session-model";
import componentsModel from "./components-model";
import pageModel from "./page-model";
import { IStoreModel } from "./model.typing";

const storeModel: IStoreModel = {
  app: appModel,
  session: sessionModel,
  page: pageModel,
  components: componentsModel,
};

export default storeModel;
