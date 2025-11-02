import { mergeQueryKeys } from "@lukemorales/query-key-factory";

import { adminQueries } from "./admin/api";
import { careQueries } from "./care/api";
import { fcmQueries } from "./fcm/api";
import { nlpQueries } from "./nlp/api";
import { questionsQueries } from "./questions/api";
import { systemQueries } from "./system/api";
import { testQueries } from "./test/api";
import { userQueries } from "./user/api";
import { voicesQueries } from "./voices/api";

export const queries = mergeQueryKeys(
  userQueries,
  voicesQueries,
  careQueries,
  adminQueries,
  nlpQueries,
  questionsQueries,
  systemQueries,
  testQueries,
  fcmQueries
);

export const matchMultiQueries = (queryKeys: readonly any[]) => {
  return (query: any) =>
    queryKeys.some((queryKey) => {
      return false;
    });
};
