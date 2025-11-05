import { Emotion } from "@/entities/voices/api/schema";

export enum Role {
  CARE = "CARE",
  USER = "USER",
}
export interface UserInfo {
  user_code: string;
  username: string;
  name: string;
  role: Role;
}

export const USER_STORAGE_KEY = "@user_info";

export interface SignInRequest {
  username: string;
  password: string;
  role: Role;
}

export interface SignUpRequest {
  name: string;
  birthdate: string;
  username: string;
  password: string;
  role: Role;
  connecting_user_code: string;
}

export interface SignInResponse {
  message: string;
  username: string;
  name: string;
  role: Role;
}

export interface SignUpResponse {
  message: string;
  user_code: string;
  username: string;
  name: string;
  role: Role;
}

export interface UserInfoResponse {
  name: string;
  username: string;
  connected_care_name: string;
}

export type GetUserInfoResponse = UserInfo;

export interface MonthlyFrequencyRequest {
  username: string;
  month: string; // e.g. 2025-10
}

type Optional<T> = {
  [K in keyof T]?: T[K];
};

export interface MonthlyFrequencyResponse {
  success: boolean;
  frequency: Optional<Record<Emotion, number>>;
  message: string;
}

export interface WeeklySummaryRequest {
  username: string;
  month: string; // e.g. 2025-10
  week: number; // 1..5
}

export interface WeeklySummaryResponse {
  message: string;
  weekly: {
    // 'YYYY-MM-DD'
    date: string;
    weekday: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
    top_emotion: Emotion;
  }[];
}
