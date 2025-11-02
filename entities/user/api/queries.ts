import { createQueryKeys } from "@lukemorales/query-key-factory";

import { getUserInfo } from "./handler";
import { getLocalUserInfo } from "./storage";

export const userQueries = createQueryKeys("user", {
  userInfo: {
    queryKey: null,
    queryFn: () => getLocalUserInfo(),
  },
  userPageInfo: (username: string) => ({
    queryKey: [username],
    queryFn: () => getUserInfo({ username }),
  }),
});
