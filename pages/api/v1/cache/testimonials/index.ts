import { NextApiResponse } from "next";
import nextConnect from "next-connect";
import mongodbConnection from "../../../../../middleware/mongodb-connection";
import { ITestimonial } from "../../../../../model/model.typing";
import { ExtendedRequest } from "../../../../../server-model/server-model.typing";

const handler = nextConnect();

handler.use(mongodbConnection);

handler.get<ExtendedRequest, NextApiResponse>(async ({ db, dbClient }, res) => {
  try {
    const projection = {
      externalId: false,
    };

    const testimonials: Array<ITestimonial> = await db
      .collection("testimonials")
      .find({}, { projection })
      .toArray();

    res.status(200);
    res.json({ testimonials });
  } catch (error) {
    console.error(error);
  } finally {
    await dbClient.close();
  }
});

export default handler;
