import { createQueryKeys } from "@lukemorales/query-key-factory";
import { getUserVoiceDetail, getUserVoiceList } from "./handler";

export const voicesQueries = createQueryKeys("voices", {
  userVoiceList: (username: string) => ({
    queryKey: [username],
    queryFn: () => getUserVoiceList(username),
  }),
  userVoiceDetail: (voiceId: number, username: string) => ({
    queryKey: [voiceId, username],
    queryFn: () => getUserVoiceDetail(voiceId, username),
  }),
});
