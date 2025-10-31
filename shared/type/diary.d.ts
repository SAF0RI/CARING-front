export type Diary = {
  id: string;
  fileName: string;
  serverUrl?: string;
  fileUri?: string;
  duration: number;
  createdAt: string;
  title: string;
  content?: string;
  serverId?: string;
  emotion: "unknown" | "anxiety" | "calm" | "happy" | "sad";
};
