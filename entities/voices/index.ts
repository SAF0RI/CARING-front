import { mergeQueryKeys } from "@lukemorales/query-key-factory";

import { voicesQueries } from "./api";

export const queries = mergeQueryKeys(voicesQueries);
