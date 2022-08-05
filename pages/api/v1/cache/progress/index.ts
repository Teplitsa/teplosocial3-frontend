import { NextApiResponse } from "next";
import nextConnect from "next-connect";
import mongodbConnection from "../../../../../middleware/mongodb-connection";
import { ICourseCard } from "../../../../../model/model.typing";
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

      const result: {
        study?: ICourseCard;
        completed?: ICourseCard;
      } = {
        study: null,
        completed: null,
      };

      const userProgress: {
        recentCompletedCourseId: number;
        nextBlockSlug: string;
        nextBlockTitle: string;
        study: ICourseCard;
      } = await db
        .collection("user_progress")
        .aggregate([
          {
            $lookup: {
              from: "courses",
              localField: "recentStudiedCourseId",
              foreignField: "externalId",
              as: "started_course",
            },
          },
          { $unwind: "$started_course" },
          {
            $match: {
              $and: [{ userId: Number(query["filter[user_id]"]) }],
            },
          },
          {
            $project: {
              _id: false,
              recentCompletedCourseId: true,
              nextBlockSlug: true,
              nextBlockTitle: true,
              study: {
                id: "$started_course.externalId",
                slug: "$started_course.slug",
                thumbnail: "$started_course.thumbnail",
                duration: "$started_course.duration",
                points: "$started_course.points",
                title: "$started_course.title",
                teaser: "$started_course.teaser",
                trackId: "$completed_course.trackId",
                trackSlug: "$completed_course.trackSlug",
                trackTitle: "$completed_course.trackTitle",
              },
            },
          },
        ])
        .next();

      if (!Object.is(userProgress, null)) {
        const { recentCompletedCourseId, nextBlockSlug, nextBlockTitle, study } =
          userProgress;

        if (typeof study.slug === "string" && study.slug.trim().length > 0) {
          result.study = { ...study, nextBlockSlug, nextBlockTitle };
        } else if (typeof recentCompletedCourseId === "number") {
          const {
            completed,
          }: {
            completed?: ICourseCard;
          } = await db
            .collection("user_progress")
            .aggregate([
              {
                $lookup: {
                  from: "courses",
                  localField: "recentCompletedCourseId",
                  foreignField: "externalId",
                  as: "completed_course",
                },
              },
              { $unwind: "$completed_course" },
              {
                $match: {
                  $and: [{ userId: Number(query["filter[user_id]"]) }],
                },
              },
              {
                $project: {
                  _id: false,
                  completed: {
                    id: "$completed_course.externalId",
                    slug: "$completed_course.slug",
                    thumbnail: "$completed_course.thumbnail",
                    duration: "$completed_course.duration",
                    points: "$completed_course.points",
                    title: "$completed_course.title",
                    teaser: "$completed_course.teaser",
                    trackId: "$completed_course.trackId",
                    trackSlug: "$completed_course.trackSlug",
                    trackTitle: "$completed_course.trackTitle",
                  },
                },
              },
            ])
            .next();

          if (
            typeof completed.slug === "string" &&
            completed.slug.trim().length > 0
          ) {
            result.completed = completed;
          }
        }
      }

      res.status(200);
      res.json({ ...result });
    } catch (error) {
      console.error(error);
    } finally {
      await dbClient.close();
    }
  }
);

export default handler;
