import {
  DeleteAxiosInstance,
  GetAxiosInstance,
  PostAxiosInstance,
} from "@/shared/axios/axios.method";

import {
  UploadVoiceRequest,
  UploadVoiceResponse,
  UploadVoiceWithQuestionRequest,
  VoiceQuestionUploadResponse,
  UserVoiceListResponse,
  UserVoiceDetailResponse,
} from "./schema";

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

// POST /users/voices (multipart) with question_id and optional username in query
export const uploadVoiceWithQuestion = async ({
  file,
  question_id,
  username,
}: UploadVoiceWithQuestionRequest): Promise<VoiceQuestionUploadResponse> => {
  const formData = new FormData();
  formData.append("file", {
    uri: file.uri,
    type: file.type,
    name: file.name,
  } as any);
  formData.append("question_id", String(question_id));

  const query = username ? `?username=${encodeURIComponent(username)}` : "";
  const response = await PostAxiosInstance<VoiceQuestionUploadResponse>(
    `/users/voices${query}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

// GET /users/voices?username=...
export const getUserVoiceList = async (
  username: string
): Promise<UserVoiceListResponse> => {
  const response = await GetAxiosInstance<UserVoiceListResponse>(
    `/users/voices?username=${encodeURIComponent(username)}`
  );
  return response.data;
};

// GET /users/voices/{voice_id}?username=...
export const getUserVoiceDetail = async (
  voiceId: number,
  username: string
): Promise<UserVoiceDetailResponse> => {
  const response = await GetAxiosInstance<UserVoiceDetailResponse>(
    `/users/voices/${voiceId}?username=${encodeURIComponent(username)}`
  );
  return response.data;
};

// DELETE /users/voices/{voice_id}?username=...
export const deleteUserVoice = async (
  voiceId: number,
  username: string
): Promise<Record<string, any>> => {
  const response = await DeleteAxiosInstance<Record<string, any>>(
    `/users/voices/${voiceId}?username=${encodeURIComponent(username)}`
  );
  return response.data;
};
