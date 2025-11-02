import { PostAxiosInstance } from "@/shared/axios/axios.method";

import {
  FcmTokenDeactivateResponse,
  FcmTokenRegisterRequest,
  FcmTokenRegisterResponse,
} from "./schema";

export const registerFcmToken = async ({
  username,
  ...requestBody
}: {
  username: string;
} & FcmTokenRegisterRequest): Promise<FcmTokenRegisterResponse> => {
  const response = await PostAxiosInstance<FcmTokenRegisterResponse>(
    `/users/fcm/register?username=${username}`,
    requestBody
  );
  return response.data;
};

export const deactivateFcmToken = async ({
  username,
  device_id,
}: {
  username: string;
  device_id?: string | null;
}): Promise<FcmTokenDeactivateResponse> => {
  const queryParams = new URLSearchParams({
    username,
  });
  if (device_id) {
    queryParams.append("device_id", device_id);
  }

  const response = await PostAxiosInstance<FcmTokenDeactivateResponse>(
    `/users/fcm/deactivate?${queryParams.toString()}`,
    undefined
  );
  return response.data;
};

