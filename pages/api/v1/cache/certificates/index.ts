import { NextApiResponse } from "next";
import nextConnect from "next-connect";
import mongodbConnection from "../../../../../middleware/mongodb-connection";
import { ICertificate } from "../../../../../model/model.typing";
import { ExtendedAuthRequest } from "../../../../../server-model/server-model.typing";
import { getRestApiUrl } from "../../../../../utilities/utilities";

const handler = nextConnect();

handler.use(mongodbConnection);

handler.get<ExtendedAuthRequest, NextApiResponse>(
  async ({ db, dbClient, query, headers }, res) => {
    try {
      if (Number.isNaN(Number(query["filter[user_id]"]))) {
        res.status(404);
        res.end();

        throw new Error("Invalid filter parameter");
      }

      if (typeof headers["x-auth-token"] !== "string") {
        res.status(400);
        res.end();

        throw new Error("No auth header");
      }

      const requestUrl = new URL(getRestApiUrl(`/tps/v1/auth/validate-token`));

      const response = await fetch(requestUrl.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${headers["x-auth-token"]}`,
        },
        body: JSON.stringify({
          short_response: true,
        }),
      });

      const { is_valid: isValid, user } = await response.json();

      if (!isValid || user?.id !== Number(query["filter[user_id]"])) {
        res.status(401);
        res.end();

        throw new Error("Unauthorized request");
      }

      const projection = {
        _id: false,
        userId: false,
        dateTime: false,
      };

      const certificates: Array<ICertificate> = await db
        .collection("certificates")
        .find({ userId: Number(query["filter[user_id]"]) }, { projection })
        .toArray();

      res.status(200);
      res.json({ certificates });
    } catch (error) {
      console.error(error);
    } finally {
      await dbClient.close();
    }
  }
);

export default handler;
