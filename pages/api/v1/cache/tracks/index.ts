import { NextApiResponse } from "next";
import nextConnect from "next-connect";
import { ICourseCard } from "../../../../../model/model.typing";
import mongodbConnection from "../../../../../middleware/mongodb-connection";
import { ExtendedTrackRequest } from "../../../../../server-model/server-model.typing";
import { getRestApiUrl } from "../../../../../utilities/utilities";

const handler = nextConnect();

handler.use(mongodbConnection);

handler.get<ExtendedTrackRequest, NextApiResponse>(
  async ({ db, dbClient, query, headers }, res) => {
    try {
      const searchMode =
        query["search_mode"] === "exact" ? "exact" : "morphological";
      const skip =
        Number.isNaN(Number(query["skip"])) || Number(query["skip"]) < 0
          ? 0
          : Number(query["skip"]);
      const limit = Number.isNaN(Number(query["limit"]))
        ? 0
        : Number(query["limit"]);
      let total = 0;
      let user: { id: number } = null;
      let userData: {
        completedTrackIds?: Array<number>;
        progressPerTrack?: Array<[number, string]>;
      } = null;
      let tracks: Array<ICourseCard> = null;

      const projection = {
        tags: false,
      };

      const collectionQuery = {};

      if (typeof query["s"] === "string" && query["s"].trim().length > 0) {
        switch (searchMode) {
          case "exact":
            collectionQuery["title"] = {
              $regex: `${query["s"].trim()}`,
              $options: "i",
            };
            break;
          case "morphological":
            collectionQuery["$text"] = { $search: query["s"].trim() };
            break;
        }
      }

      if (
        (typeof query["filter[tag_id]"] === "string" ||
          Array.isArray(query["filter[tag_id]"])) &&
        query["filter[tag_id]"].length > 0
      ) {
        const tag_ids = (
          Array.isArray(query["filter[tag_id]"])
            ? query["filter[tag_id]"]
            : query["filter[tag_id]"].split(",")
        )
          .filter((tag_id) => !Number.isNaN(Number(tag_id)))
          .map((tag_id) => Number(tag_id));

        if (tag_ids.length > 0) {
          collectionQuery["tags"] = { $in: tag_ids };
        }
      }

      if (typeof query["s"] === "string" && query["s"].trim().length > 0) {
        total = await db
          .collection("tracks")
          .find(collectionQuery, {
            ...{ projection },
            ...(searchMode === "exact"
              ? {}
              : { score: { $meta: "textScore" } }),
          })
          .count();

        if (total > 0) {
          tracks = await db
            .collection("tracks")
            .find(collectionQuery, {
              ...{ projection },
              ...(searchMode === "exact"
                ? {}
                : { score: { $meta: "textScore" } }),
            })
            .sort(
              searchMode === "exact"
                ? { externalId: -1 }
                : { score: { $meta: "textScore" } }
            )
            .skip(skip)
            .limit(limit)
            .toArray();
        }
      } else {
        total = await db
          .collection("tracks")
          .find(collectionQuery, { projection })
          .count();

        if (total > 0) {
          tracks = await db
            .collection("tracks")
            .find(collectionQuery, { projection })
            .skip(skip)
            .limit(limit)
            .toArray();
        }
      }

      // Check if authenticated user

      if (
        typeof headers["x-auth-token"] === "string" &&
        headers["x-auth-token"].length > 0
      ) {
        const requestUrl = new URL(
          getRestApiUrl(`/tps/v1/auth/validate-token`)
        );

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

        const result = await response.json();

        if (result.is_valid) {
          user = result.user;
        }
      }

      if (tracks?.length && user?.id) {
        userData = await db
          .collection("user_progress")
          .find(
            {
              userId: { $eq: user.id },
            },
            {
              projection: {
                _id: false,
                progressPerTrack: true,
                completedTrackIds: true,
              },
            }
          )
          .next();

        tracks = tracks.map((track) => {
          track["isCompleted"] = Boolean(
            userData?.completedTrackIds?.includes(track.externalId)
          );

          if (track["isCompleted"]) {
            return track;
          }

          const progress = new Map(userData?.progressPerTrack ?? []);

          if (progress.has(track.externalId)) {
            track["progress"] = progress.get(track.externalId);
          }

          return track;
        });
      }

      res.status(200);

      res.json({ tracks, total });
    } catch (error) {
      console.error(error);
    } finally {
      await dbClient.close();
    }
  }
);

export default handler;
