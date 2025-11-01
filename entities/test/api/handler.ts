import { PostAxiosInstance } from "@/shared/axios/axios.method";
import { TestEmotionAnalyzeRequest, VoiceAnalyzePreviewResponse } from "./schema";

export const testEmotionAnalyze = async (
  params: TestEmotionAnalyzeRequest
): Promise<VoiceAnalyzePreviewResponse> => {
  const formData = new FormData();
  formData.append("file", {
    uri: params.file.uri,
    type: params.file.type,
    name: params.file.name,
  } as any);

  const response = await PostAxiosInstance<VoiceAnalyzePreviewResponse>(
    "/test/voice/analyze",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

