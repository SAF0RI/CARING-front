import { createQueryKeys } from "@lukemorales/query-key-factory";
import {
  getUserVoiceDetail,
  getUserVoiceList,
  getVoiceAnalyzePreview,
} from "./handler";

export const voicesQueries = createQueryKeys("voices", {
  userVoiceList: (username: string) => ({
    queryKey: [username],
    queryFn: () => getUserVoiceList(username),
  }),
  userVoiceDetail: (voiceId: number, username: string) => ({
    queryKey: [voiceId, username],
    queryFn: () => getUserVoiceDetail(voiceId, username),
  }),
  voiceAnalyzePreview: (voiceId: number, care_username: string) => ({
    queryKey: [voiceId, care_username],
    queryFn: () =>
      getVoiceAnalyzePreview({
        voice_id: voiceId,
        care_username: care_username,
      }),
  }),
});
