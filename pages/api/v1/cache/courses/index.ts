import { NextApiResponse } from "next";
import nextConnect from "next-connect";
import { ICourseCard } from "../../../../../model/model.typing";
import mongodbConnection from "../../../../../middleware/mongodb-connection";
import { ExtendedCourseRequest } from "../../../../../server-model/server-model.typing";
import { getRestApiUrl } from "../../../../../utilities/utilities";

const handler = nextConnect();

handler.use(mongodbConnection);

handler.get<ExtendedCourseRequest, NextApiResponse>(
  async ({ db, dbClient, query, headers }, res) => {
    try {
      const courseStatus =
        (typeof query["filter[status]"] === "string" ||
          Array.isArray(query["filter[status]"])) &&
        query["filter[status]"].length > 0
          ? (Array.isArray(query["filter[status]"])
              ? query["filter[status]"]
              : query["filter[status]"].split(",")
            )
              .filter((status) => ["started", "completed"].includes(status))
              .map((status) => String(status))
          : null;
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
        completedCourseIds?: Array<number>;
        progressPerCourse?: Array<[number, string]>;
        lastActionTimePerCourse?: Array<[number, number]>;
      } = null;
      let courses: Array<ICourseCard> = null;

      const projection = {};

      const collectionQuery = {};

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
        const tagIds = (
          Array.isArray(query["filter[tag_id]"])
            ? query["filter[tag_id]"]
            : query["filter[tag_id]"].split(",")
        )
          .filter((tag_id) => !Number.isNaN(Number(tag_id)))
          .map((tag_id) => Number(tag_id));

        if (tagIds.length > 0) {
          collectionQuery["tags"] = { $in: tagIds };
        }
      }

      if (
        typeof query["filter[track_id]"] === "string" &&
        query["filter[track_id]"].length > 0 &&
        Number.isInteger(Number(query["filter[track_id]"]))
      ) {
        const trackId = Number(query["filter[track_id]"]);

        collectionQuery["trackId"] = { $eq: trackId };
      }

      if (typeof query["s"] === "string" && query["s"].trim().length > 0) {
        total = await db
          .collection("courses")
          .find(collectionQuery, {
            ...{ projection },
            ...(searchMode === "exact"
              ? {}
              : { score: { $meta: "textScore" } }),
          })
          .count();

        if (total > 0) {
          courses = await db
            .collection("courses")
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
            .skip(!Object.is(courseStatus, null) && user?.id ? 0 : skip)
            .limit(!Object.is(courseStatus, null) && user?.id ? 0 : limit)
            .toArray();
        }
      } else {
        total = await db
          .collection("courses")
          .find(collectionQuery, { projection })
          .count();

        if (total > 0) {
          courses = await db
            .collection("courses")
            .find(collectionQuery, { projection })
            .skip(!Object.is(courseStatus, null) && user?.id ? 0 : skip)
            .limit(!Object.is(courseStatus, null) && user?.id ? 0 : limit)
            .toArray();
        }
      }

      if (courses?.length && user?.id) {
        userData = await db
          .collection("user_progress")
          .find(
            {
              userId: { $eq: user.id },
            },
            {
              projection: {
                _id: false,
                progressPerCourse: true,
                completedCourseIds: true,
                lastActionTimePerCourse: true,
              },
            }
          )
          .next();

        courses = courses
          .map((course) => {
            course["isCompleted"] = Boolean(
              userData?.completedCourseIds?.includes(course.externalId)
            );

            if (course["isCompleted"]) {
              return course;
            }

            const progress = new Map(userData?.progressPerCourse ?? []);

            if (progress.has(course.externalId)) {
              course["progress"] = progress.get(course.externalId);
            }

            
            // console.log("userData?.lastActionTimePerCourse:", userData?.lastActionTimePerCourse)
            const lastActionTime = new Map(userData?.lastActionTimePerCourse ?? []);            
            // console.log("lastActionTime:", lastActionTime)
            if (lastActionTime.has(course.externalId)) {
              course["lastActionTime"] = lastActionTime.get(course.externalId);
              // console.log("course.externalId:", course.externalId)
              // console.log("lastActionTime111:", course["lastActionTime"])
            }
            else {
              course["lastActionTime"] = 0
            }

            return course;
          })
          .filter((course) => {
            if (Object.is(courseStatus, null)) {
              return true;
            }

            let conditionMatched = false;

            if (!conditionMatched && courseStatus.includes("started")) {
              conditionMatched = Boolean(course["progress"]);
            }

            if (!conditionMatched && courseStatus.includes("completed")) {
              conditionMatched = course["isCompleted"] ?? false;
            }

            return conditionMatched;
          })
          .sort((a, b) => b.lastActionTime - a.lastActionTime);

        if (!Object.is(courseStatus, null)) {
          total = courses.length;

          courses = courses.slice(
            skip,
            skip + limit === 0 ? undefined : skip + limit
          );
        }
      }

      res.status(200);

      res.json({ courses, total });
    } catch (error) {
      console.error(error);
    } finally {
      await dbClient.close();
    }
  }
);

export default handler;
