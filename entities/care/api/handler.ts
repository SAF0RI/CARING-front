import { GetAxiosInstance } from "@/shared/axios/axios.method";

import {
  CareUserInfoResponse,
  CareUserVoiceListResponse,
  MonthlyFrequencyRequest,
  MonthlyFrequencyResponse,
  WeeklySummaryRequest,
  WeeklySummaryResponse,
} from "./schema";

export const getCareUserVoiceList = async (
  care_username: string,
  skip: number = 0,
  limit: number = 100
): Promise<CareUserVoiceListResponse> => {
  const query = `care_username=${encodeURIComponent(care_username)}&skip=${skip}&limit=${limit}`;
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
    `/care?username=${care_username}`
  );
  return response.data;
};
