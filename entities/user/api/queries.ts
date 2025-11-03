import { createQueryKeys } from "@lukemorales/query-key-factory";

import {
  getUserInfo,
  getUserMonthlyFrequency,
  getUserWeeklySummary,
} from "./handler";
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
  weeklySummary: (username: string, month: string, week: number) => ({
    queryKey: [username, month, week],
    queryFn: () => getUserWeeklySummary({ username, month, week }),
  }),
  monthlyFrequency: (username: string, month: string) => ({
    queryKey: [username, month],
    queryFn: () => getUserMonthlyFrequency({ username, month }),
  }),
});
