import { mergeQueryKeys } from "@lukemorales/query-key-factory";

import { fcmQueries } from "./api";

export const queries = mergeQueryKeys(fcmQueries);

