import { Db, MongoClient } from "mongodb";
import { NextApiRequest } from "next";

export interface ExtendedRequest {
  dbClient: MongoClient;
  db: Db;
  query: {
    limit?: number;
  };
}

export interface ExtendedPageRequest extends ExtendedRequest {
  query: {
    limit?: number;
    slug?: string;
    only_seo?: boolean;
  };
}

export interface ExtendedAuthRequest extends ExtendedRequest {
  query: {
    limit?: number;
    "filter[user_id]"?: number;
  };
}

export interface ExtendedCourseRequest extends ExtendedRequest {
  query: {
    limit?: number;
    skip?: number;
    s?: string;
    "filter[tag_id]"?: string | Array<string>;
  };
}

export interface ExtendedTrackRequest extends ExtendedCourseRequest {}

export interface ExtendedRequestOriginalQuery extends NextApiRequest {
  dbClient: MongoClient;
  db: Db;
}
