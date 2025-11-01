export interface CareVoiceListItem {
  voice_id: number;
  created_at: string;
  emotion?: string | null;
}

export interface CareUserVoiceListResponse {
  success: boolean;
  voices: CareVoiceListItem[];
}

export interface MonthlyFrequencyRequest {
  care_username: string;
  month: string; // e.g. 2025-10
}

export interface MonthlyFrequencyResponse {
  success: boolean;
  frequency: {
    unknown?: number;
    happy?: number;
    calm?: number;
    surprise?: number;
    sad?: number;
    anxiety?: number;
    angry?: number; // API에서는 "angry"로 오지만 코드에서는 "anger"로 사용
  };
}

export interface WeeklySummaryRequest {
  care_username: string;
  month: string; // e.g. 2025-10
  week: number; // 1..5
}

export type WeeklySummaryResponse = Record<string, any>;
