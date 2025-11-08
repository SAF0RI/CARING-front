import { registerFcmToken } from "@/entities/fcm/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const FCM_TOKEN_KEY = "fcm-token";
const DEVICE_ID_KEY = "fcm-device-id";
const PENDING_DEACTIVATE_KEY = "pending-fcm-deactivate-username";

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
    deviceId = Constants.installationId || generateUUID();
    if (deviceId) {
      await SecureStore.setItemAsync(DEVICE_ID_KEY, deviceId);
    } else {
      deviceId = generateUUID();
      await SecureStore.setItemAsync(DEVICE_ID_KEY, deviceId);
    }
  }
  return deviceId;
};

export const getTokenAndSaveTokenProcess = async (): Promise<{
  success: boolean;
  error?: Error;
}> => {
  try {
    if (!(await SecureStore.getItemAsync(FCM_TOKEN_KEY))) {
      const tokenData = await Notifications.getDevicePushTokenAsync();
      const token = tokenData.data;
      await SecureStore.setItemAsync(FCM_TOKEN_KEY, token);
      // @description : token은 별도 api를 통해서 만료하지 않는 이상 항상 같은 값을 보장함.
    }
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
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
    const deviceId = await getStoredDeviceId();

    await deactivateFcmToken({
      username,
      device_id: deviceId || null,
    });

    await AsyncStorage.removeItem(PENDING_DEACTIVATE_KEY);

    return { success: true };
  } catch (error) {
    try {
      await AsyncStorage.setItem(PENDING_DEACTIVATE_KEY, username);
      console.log(
        "FCM 토큰 비활성화 실패, 다음 로그인 시 재시도하도록 저장:",
        username
      );
    } catch (storageError) {
      console.error("AsyncStorage 저장 실패:", storageError);
    }

    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
};

export const getPendingDeactivateUsername = async (): Promise<
  string | null
> => {
  try {
    return await AsyncStorage.getItem(PENDING_DEACTIVATE_KEY);
  } catch (error) {
    console.error(
      "AsyncStorage에서 pending deactivate username 가져오기 실패:",
      error
    );
    return null;
  }
};

export const retryPendingDeactivate = async (): Promise<{
  success: boolean;
  error?: Error;
}> => {
  try {
    const username = await getPendingDeactivateUsername();
    if (!username) {
      return { success: true };
    }

    const result = await deactivateFcmTokenFromServer(username);
    return result;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
};
