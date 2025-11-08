import { Emotion } from "@/entities/voices/api/schema";
export const normalizeEmotion = (raw?: string): Emotion | null => {
  if (!raw) return null;
  const v = String(raw).trim().toLowerCase();
  // 영어
  if (["happy", "joy", "joyful"].includes(v)) return "happy";
  if (
    ["calm", "stable", "peace", "peaceful", "stability", "neutral"].includes(v)
  )
    return "neutral";
  if (["surprise", "surprised"].includes(v)) return "surprise";
  if (["sad", "sadness"].includes(v)) return "sad";
  if (["anxiety", "anxious", "anxiety"].includes(v)) return "anxiety";
  if (["anger", "angry", "rage"].includes(v)) return "angry";
  // 한국어
  if (["즐거움", "기쁨"].includes(raw)) return "happy";
  if (["평온", "안정"].includes(raw)) return "neutral";
  if (["놀람"].includes(raw)) return "surprise";
  if (["슬픔"].includes(raw)) return "sad";
  if (["불안"].includes(raw)) return "anxiety";
  if (["분노"].includes(raw)) return "angry";
  return null;
};
