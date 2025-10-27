import { PostAxiosInstance } from "@/shared/axios/axios.method";

import { UploadVoiceRequest, UploadVoiceResponse } from "./schema";

export const uploadVoice = async ({
  file,
  username,
}: UploadVoiceRequest): Promise<UploadVoiceResponse> => {
  const formData = new FormData();

  // FormData에 파일 추가
  formData.append("file", {
    uri: file.uri,
    type: file.type,
    name: file.name,
  } as any);

  // FormData에 username 추가
  formData.append("username", username);

  const response = await PostAxiosInstance<UploadVoiceResponse>(
    "/users/voices",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};
