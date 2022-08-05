import * as _ from "lodash";
import * as utils from "../utilities/utilities";

export async function requestMediaData(mediaId) {
  let error = "";
  let data = {};

  try {
    let url = new URL(utils.getRestApiUrl(`/wp/v2/media/${mediaId}`));

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

  return {error, data};
}
