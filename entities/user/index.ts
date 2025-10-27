import { mergeQueryKeys } from "@lukemorales/query-key-factory";

import { userQueries } from "./api";

export const queries = mergeQueryKeys(userQueries);
