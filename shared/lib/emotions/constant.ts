import { Emotion } from "@/entities/voices/api/schema";
export const emotionKorMap: Record<Emotion | "unknown", string> = {
  happy: "즐거움",
  calm: "안정",
  surprise: "놀람",
  sad: "슬픔",
  anxiety: "불안",
  unknown: "분석 중",
  anger: "분노",
};

export const emotionBgColorMap: Record<Emotion, string> = {
  unknown: "bg-gray10",
  anxiety: "bg-anxietyBg",
  calm: "bg-calmBg",
  happy: "bg-happyBg",
  sad: "bg-sadBg",
  surprise: "bg-yellow300",
  anger: "bg-red50",
};

export const emotionTextColorMap: Record<Emotion, string> = {
  unknown: "text-gray90",
  anxiety: "text-anxietyText",
  calm: "text-calmText",
  happy: "text-happyText",
  sad: "text-sadText",
  surprise: "text-yellow900",
  anger: "text-red900",
};

export const emotionRawColorMap: Record<Emotion, string> = {
  happy: "#FF9500", // 오렌지
  calm: "#34C759", // 초록
  surprise: "#FFCC00", // 노랑
  sad: "#007AFF", // 파랑
  anxiety: "#FF6B6B", // 주황빨강
  anger: "#FF3B30", // 빨강
  unknown: "#8E8E93", // 회색
};
