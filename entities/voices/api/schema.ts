// Common file type for React Native FormData
export interface RNFileParam {
  uri: string;
  type: string;
  name: string;
}

export type Emotion =
  | "unknown"
  | "anxiety"
  | "calm"
  | "happy"
  | "sad"
  | "surprise";

// Upload voice with question (multipart/form-data + optional username query)
export interface UploadVoiceWithQuestionRequest {
  file: RNFileParam;
  question_id: number;
  username?: string;
}

export interface VoiceQuestionUploadResponse {
  success: boolean;
  message: string;
  voice_id?: number | null;
  question_id?: number | null;
}

// GET /users/voices
export interface VoiceListItem {
  voice_id: number;
  created_at: string;
  emotion?: Emotion | null;
  question_title?: string | null;
  content: string;
}

export interface UserVoiceListResponse {
  success: boolean;
  voices: VoiceListItem[];
}

// GET /users/voices/{voice_id}
export interface UserVoiceDetailResponse {
  voice_id: number;
  title?: string | null;
  top_emotion?: Emotion | null;
  created_at: string;
  voice_content?: string | null;
}

// Backward-compatible simple upload (without question). Keep if referenced elsewhere.
export interface UploadVoiceRequest {
  file: RNFileParam;
  username: string;
}

export interface UploadVoiceResponse {
  message: string;
  voiceId?: string;
  fileUrl?: string;
}
