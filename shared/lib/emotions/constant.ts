import { Emotion } from "@/entities/voices/api/schema";
export const emotionKorMap: Record<Emotion | "unknown", string> = {
  happy: "즐거움",
  neutral: "안정",
  surprise: "놀람",
  sad: "슬픔",
  fear: "불안",
  unknown: "분석 중",
  angry: "분노",
} as const;

export const emotionBgColorMap: Record<Emotion, string> = {
  unknown: "bg-gray10",
  fear: "bg-point50",
  neutral: "bg-green50",
  happy: "bg-point50",
  sad: "bg-blue50",
  surprise: "bg-yellow50",
  angry: "bg-red50",
} as const;

export const emotionTextColorMap: Record<Emotion, string> = {
  unknown: "text-gray90",
  fear: "text-point700",
  neutral: "text-green700",
  happy: "text-point700",
  sad: "text-blue700",
  surprise: "text-yellow700",
  angry: "text-red700",
} as const;

export const emotionRawColorMap: Record<Emotion, string> = {
  happy: "#FF9500", // 오렌지
  neutral: "#34C759", // 초록
  surprise: "#FFCC00", // 노랑
  sad: "#007AFF", // 파랑
  fear: "#FF6B6B", // 주황빨강
  angry: "#FF3B30", // 빨강
  unknown: "#8E8E93", // 회색
} as const;

export const defaultLabels = [
  "neutral",
  "happy",
  "sad",
  "angry",
  "fear",
  "surprise",
] as const;
