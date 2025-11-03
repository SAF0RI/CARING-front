import { createQueryKeys } from "@lukemorales/query-key-factory";
import {
  getCareUserInfo,
  getCareUserVoiceList,
  getEmotionMonthlyFrequency,
  getEmotionWeeklySummary,
  getNotifications,
  getTopEmotion,
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
  careUserVoiceList: (care_username: string, date?: Date | string | null) => ({
    queryKey: [
      care_username,
      typeof date === "string"
        ? date
        : date
          ? date.toISOString().split("T")[0]
          : "",
    ],
    queryFn: () => getCareUserVoiceList({ care_username, date }),
  }),
  careUserInfo: (care_username: string) => ({
    queryKey: [care_username],
    queryFn: () => getCareUserInfo({ care_username }),
  }),
  topEmotion: (care_username: string) => ({
    queryKey: [care_username],
    queryFn: () => getTopEmotion({ care_username }),
  }),
  notifications: (care_username: string) => ({
    queryKey: [care_username],
    queryFn: () => getNotifications({ care_username }),
  }),
});
