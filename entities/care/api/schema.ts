import { Emotion } from "@/entities/voices/api/schema";
export interface CareVoiceListItem {
  voice_id: number;
  created_at: string;
  emotion?: Emotion | null;
}

export interface CareUserVoiceListResponse {
  success: boolean;
  voices: CareVoiceListItem[];
}

export interface MonthlyFrequencyRequest {
  care_username: string;
  month: string; // e.g. 2025-10
}

type Optional<T> = {
  [K in keyof T]?: T[K];
};

export interface MonthlyFrequencyResponse {
  success: boolean;
  frequency: Optional<Record<Emotion, number>>;
}

export interface WeeklySummaryRequest {
  care_username: string;
  month: string; // e.g. 2025-10
  week: number; // 1..5
}

export interface CareUserInfoResponse {
  name: string;
  username: string;
  connected_user_name: string;
}

export interface WeeklySummaryResponse {
  weekly: {
    // 'YYYY-MM-DD'
    date: string;
    weekday: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
    top_emotion: Emotion;
  }[];
}

export interface CareUserVoiceDetailResponse {
  success: boolean;
  voice: {
    voice_id: number;
    created_at: string; // ISO string
    top_emotion?: Emotion | null;
    transcript?: string;
    emotions?: Partial<Record<Emotion, number>>;
  };
}

export interface TopEmotionRequest {
  care_username: string;
}

export interface TopEmotionResponse {
  date: string;
  user_name: string;
  top_emotion: Emotion;
}
