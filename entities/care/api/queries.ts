import { createQueryKeys } from "@lukemorales/query-key-factory";
import {
  getCareUserInfo,
  getCareUserVoiceList,
  getEmotionMonthlyFrequency,
  getEmotionWeeklySummary,
} from "./handler";

export const careQueries = createQueryKeys("care", {
  emotionWeeklySummary: (
    care_username: string,
    month: string,
    week: number
  ) => ({
    queryKey: [care_username, month, week],
    queryFn: () => getEmotionWeeklySummary({ care_username, month, week }),
  }),
  emotionMonthlyFrequency: (care_username: string, month: string) => ({
    queryKey: [care_username, month],
    queryFn: () => getEmotionMonthlyFrequency({ care_username, month }),
  }),
  careUserVoiceList: (care_username: string) => ({
    queryKey: [care_username],
    queryFn: () => getCareUserVoiceList(care_username),
  }),
  careUserInfo: (care_username: string) => ({
    queryKey: [care_username],
    queryFn: () => getCareUserInfo({ care_username }),
  }),
});
