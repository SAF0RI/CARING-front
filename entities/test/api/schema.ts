import { RNFileParam } from "@/entities/voices/api/schema";

export interface TestEmotionAnalyzeRequest {
  file: RNFileParam;
}

export interface VoiceAnalyzePreviewResponse {
  voice_id?: number | null;
  happy_bps: number;
  sad_bps: number;
  neutral_bps: number;
  angry_bps: number;
  fear_bps: number;
  surprise_bps: number;
  top_emotion?: string | null;
  top_confidence_bps?: number | null;
  model_version?: string | null;
}

