import { NextApiResponse } from "next";
import nextConnect from "next-connect";
import { ITagState } from "../../../../../model/model.typing";
import mongodbConnection from "../../../../../middleware/mongodb-connection";
import { ExtendedRequest } from "../../../../../server-model/server-model.typing";

const handler = nextConnect();

handler.use(mongodbConnection);

handler.get<ExtendedRequest, NextApiResponse>(async ({ db, dbClient }, res) => {
  try {
    const courseTags: Array<ITagState> = await db
      .collection("course_tags")
      .find({})
      .toArray();

    res.status(200);

    res.json({ courseTags });
  } catch (error) {
    console.error(error);
  } finally {
    await dbClient.close();
  }
});

export default handler;
