import { createQueryKeys } from "@lukemorales/query-key-factory";

import { getLocalUserInfo } from "./storage";

export const userQueries = createQueryKeys("user", {
  userInfo: {
    queryKey: null,
    queryFn: () => getLocalUserInfo(),
  },
});
