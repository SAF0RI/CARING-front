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

export type MonthlyFrequencyResponse = Record<string, any>;

export interface WeeklySummaryRequest {
  care_username: string;
  month: string; // e.g. 2025-10
  week: number; // 1..5
}

export type WeeklySummaryResponse = Record<string, any>;

