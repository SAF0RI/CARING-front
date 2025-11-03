import {
  GetAxiosInstance,
  PostAxiosInstance,
} from "@/shared/axios/axios.method";

import {
  MonthlyFrequencyRequest,
  MonthlyFrequencyResponse,
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  SignUpResponse,
  UserInfoResponse,
  WeeklySummaryRequest,
  WeeklySummaryResponse,
} from "./schema";

export const signIn = async ({
  username,
  password,
  role,
}: SignInRequest): Promise<SignInResponse> => {
  const response = await PostAxiosInstance<SignInResponse>(
    `/sign-in?role=${role}`,
    {
      username,
      password,
    }
  );
  return response.data;
};

export const signUp = async ({
  name,
  birthdate,
  username,
  password,
  role,
  connecting_user_code,
}: SignUpRequest): Promise<SignUpResponse> => {
  const response = await PostAxiosInstance<SignUpResponse>("/sign-up", {
    name,
    birthdate,
    username,
    password,
    role,
    connecting_user_code,
  });
  return response.data;
};

export const getUserInfo = async ({
  username,
}: {
  username: string;
}): Promise<UserInfoResponse> => {
  const response = await GetAxiosInstance<UserInfoResponse>(
    `/users?username=${username}`
  );
  return response.data;
};

export const getUserWeeklySummary = async (
  params: WeeklySummaryRequest
): Promise<WeeklySummaryResponse> => {
  const response = await GetAxiosInstance<WeeklySummaryResponse>(
    `/users/voices/analyzing/weekly?username=${params.username}&month=${params.month}&week=${params.week}`
  );
  return response.data;
};

export const getUserMonthlyFrequency = async (
  params: MonthlyFrequencyRequest
): Promise<MonthlyFrequencyResponse> => {
  const response = await GetAxiosInstance<MonthlyFrequencyResponse>(
    `/users/voices/analyzing/frequency?username=${params.username}&month=${params.month}`
  );
  return response.data;
};
