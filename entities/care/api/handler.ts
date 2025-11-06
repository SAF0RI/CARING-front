import { GetAxiosInstance } from "@/shared/axios/axios.method";

import {
  CareUserInfoResponse,
  CareUserVoiceDetailResponse,
  CareUserVoiceListResponse,
  MonthlyFrequencyRequest,
  MonthlyFrequencyResponse,
  NotificationResponse,
  TopEmotionResponse,
  WeeklySummaryRequest,
  WeeklySummaryResponse,
} from "./schema";

export const getCareUserVoiceList = async (params: {
  care_username: string;
  date?: Date | string | null;
}): Promise<CareUserVoiceListResponse> => {
  const { care_username, date } = params;
  const yyyyMMdd = (() => {
    if (!date) return "";
    if (typeof date === "string") return date; // expect 'YYYY-MM-DD'
    // 로컬 날짜를 사용하여 시간대 영향 방지
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  })();

  const query = `care_username=${encodeURIComponent(care_username)}${yyyyMMdd ? `&date=${encodeURIComponent(yyyyMMdd)}` : ""}`;
  const response = await GetAxiosInstance<CareUserVoiceListResponse>(
    `/care/users/voices?${query}`
  );
  return response.data;
};

export const getEmotionMonthlyFrequency = async (
  params: MonthlyFrequencyRequest
): Promise<MonthlyFrequencyResponse> => {
  const query = `care_username=${encodeURIComponent(params.care_username)}&month=${encodeURIComponent(params.month)}`;
  const response = await GetAxiosInstance<MonthlyFrequencyResponse>(
    `/care/users/voices/analyzing/frequency?${query}`
  );
  return response.data;
};

export const getEmotionWeeklySummary = async (
  params: WeeklySummaryRequest
): Promise<WeeklySummaryResponse> => {
  const query = `care_username=${encodeURIComponent(params.care_username)}&month=${encodeURIComponent(params.month)}&week=${params.week}`;
  const response = await GetAxiosInstance<WeeklySummaryResponse>(
    `/care/users/voices/analyzing/weekly?${query}`
  );
  return response.data;
};

export const getCareUserInfo = async ({
  care_username,
}: {
  care_username: string;
}): Promise<CareUserInfoResponse> => {
  const response = await GetAxiosInstance<CareUserInfoResponse>(
    `/care?username=${encodeURIComponent(care_username)}`
  );
  return response.data;
};

export const getCareUserVoiceDetail = async ({
  care_username,
  voice_id,
}: {
  care_username: string;
  voice_id: number;
}): Promise<CareUserVoiceDetailResponse> => {
  const response = await GetAxiosInstance<CareUserVoiceDetailResponse>(
    `/care/users/voices/${voice_id}?care_username=${encodeURIComponent(care_username)}`
  );
  return response.data;
};

export const getTopEmotion = async ({
  care_username,
}: {
  care_username: string;
}): Promise<TopEmotionResponse> => {
  const response = await GetAxiosInstance<TopEmotionResponse>(
    `/care/top_emotion?care_username=${encodeURIComponent(care_username)}`
  );
  return response.data;
};

export const getNotifications = async ({
  care_username,
}: {
  care_username: string;
}): Promise<NotificationResponse> => {
  const response = await GetAxiosInstance<NotificationResponse>(
    `/care/notifications?care_username=${encodeURIComponent(care_username)}`
  );
  return response.data;
};
