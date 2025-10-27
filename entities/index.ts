import { mergeQueryKeys } from "@lukemorales/query-key-factory";

import { userQueries } from "./user/api";
import { voicesQueries } from "./voices/api";

export const queries = mergeQueryKeys(userQueries, voicesQueries);

export const matchMultiQueries = (queryKeys: readonly any[]) => {
  return (query: any) =>
    queryKeys.some((queryKey) => {
      return false;
    });
};
