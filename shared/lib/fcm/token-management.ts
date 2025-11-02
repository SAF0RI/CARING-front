import { registerFcmToken } from "@/entities/fcm/api";
import messaging from "@react-native-firebase/messaging";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const FCM_TOKEN_KEY = "fcm-token";
const DEVICE_ID_KEY = "fcm-device-id";

// UUID v4 생성 함수
const generateUUID = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// DeviceId 생성 또는 가져오기
const getOrCreateDeviceId = async (): Promise<string> => {
  let deviceId = await SecureStore.getItemAsync(DEVICE_ID_KEY);
  if (!deviceId) {
    // expo-constants의 installationId를 우선 사용, 없으면 UUID 생성
    deviceId =
      Constants.installationId || generateUUID();
    await SecureStore.setItemAsync(DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
};

export const getTokenAndSaveTokenProcess = () => {
  const getTokenAndSaveToken = async () => {
    if (!(await SecureStore.getItemAsync(FCM_TOKEN_KEY))) {
      const token = await messaging().getToken();
      await SecureStore.setItemAsync(FCM_TOKEN_KEY, token);
      // @description : token은 별도 api를 통해서 만료하지 않는 이상 항상 같은 값을 보장함.
    }
  };

  return getTokenAndSaveToken()
    .then((result) => {
      return { success: true };
    })
    .catch((error) => {
      return { success: false, error: error };
    });
};

export const getStoredFcmToken = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync(FCM_TOKEN_KEY);
};

export const getStoredDeviceId = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync(DEVICE_ID_KEY);
};

export const registerFcmTokenToServer = async (
  username: string
): Promise<{ success: boolean; error?: Error }> => {
  try {
    const fcmToken = await getStoredFcmToken();
    if (!fcmToken) {
      return { success: false, error: new Error("FCM 토큰이 없습니다.") };
    }

    // DeviceId 생성 또는 가져오기 (등록 시 저장)
    const deviceId = await getOrCreateDeviceId();
    const platform = Platform.OS === "ios" ? "ios" : "android";

    await registerFcmToken({
      username,
      fcm_token: fcmToken,
      device_id: deviceId,
      platform: platform,
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
};

export const deactivateFcmTokenFromServer = async (
  username: string
): Promise<{ success: boolean; error?: Error }> => {
  try {
    const { deactivateFcmToken } = await import("@/entities/fcm/api");
    // 저장된 deviceId 사용 (등록 시 저장된 것)
    const deviceId = await getStoredDeviceId();

    await deactivateFcmToken({
      username,
      device_id: deviceId || null,
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
};
