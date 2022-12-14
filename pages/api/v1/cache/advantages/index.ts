import { NextApiResponse } from "next";
import nextConnect from "next-connect";
import mongodbConnection from "../../../../../middleware/mongodb-connection";
import { IAdvantage } from "../../../../../model/model.typing";
import { ExtendedRequest } from "../../../../../server-model/server-model.typing";

const handler = nextConnect();

handler.use(mongodbConnection);

handler.get<ExtendedRequest, NextApiResponse>(async ({ db, dbClient }, res) => {
  try {
    const projection = {
      externalId: false,
    };

    const advantages: Array<IAdvantage> = await db
      .collection("advantages")
      .find({}, { projection })
      .toArray();

    res.status(200);
    res.json({ advantages });
  } catch (error) {
    console.error(error);
  } finally {
    await dbClient.close();
  }
});

export default handler;
