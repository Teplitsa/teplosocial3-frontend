import { IPostState } from "../model.typing";

export const postInitialState: IPostState = {
  id: 0,
  slug: "",
  title: {rendered: ""},
  content: {rendered: ""},
  excerpt: {rendered: ""},
  yoast_head: "",
};
