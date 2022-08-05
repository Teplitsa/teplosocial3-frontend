import { NextApiResponse } from "next";
import nextConnect from "next-connect";
import { IPageState } from "../../../../../model/model.typing";
import mongodbConnection from "../../../../../middleware/mongodb-connection";
import { ExtendedPageRequest } from "../../../../../server-model/server-model.typing";

const handler = nextConnect();

handler.use(mongodbConnection);

handler.get<ExtendedPageRequest, NextApiResponse>(
  async ({ db, dbClient, query: { slug, only_seo = false } }, res) => {
    try {
      const projection = {};

      if (only_seo) {
        Object.assign(projection, {
          "yoast_head_json.title": true,
          "yoast_head_json.description": true,
          "yoast_head_json.robots": true,
          "yoast_head_json.canonical": true,
          "yoast_head_json.og_type": true,
          "yoast_head_json.og_title": true,
          "yoast_head_json.og_description": true,
          "yoast_head_json.og_url": true,
          "yoast_head_json.og_site_name": true,
          "yoast_head_json.article_author": true,
          "yoast_head_json.article_published_time": true,
          "yoast_head_json.article_modified_time": true,
          "yoast_head_json.og_image": true,
          "yoast_head_json.twitter_card": true,
          "yoast_head_json.twitter_title": true,
          "yoast_head_json.twitter_description": true,
          "yoast_head_json.twitter_image": true,
          // "yoast_head_json.schema": true,
        });
      }

      const page: IPageState = await db
        .collection("pages")
        .findOne({ slug }, { projection });

      res.status(200);
      res.json({ ...page });
    } catch (error) {
      console.error(error);
    } finally {
      await dbClient.close();
    }
  }
);

export default handler;
