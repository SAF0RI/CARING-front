import AsyncStorage from "@react-native-async-storage/async-storage";
import { USER_STORAGE_KEY, UserInfo } from "./schema";

export const getLocalUserInfo = async (): Promise<UserInfo | null> => {
  try {
    const value = await AsyncStorage.getItem(USER_STORAGE_KEY);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error("Error getting user info from AsyncStorage:", error);
    return null;
  }
};

export const setLocalUserInfo = async (
  userInfo: UserInfo
): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userInfo));
    return true;
  } catch (error) {
    console.error("Error setting user info to AsyncStorage:", error);
    return false;
  }
};

export const updateLocalUserInfo = async (
  userInfo: Partial<UserInfo>
): Promise<boolean> => {
  try {
    const existingInfo = await getLocalUserInfo();
    if (existingInfo) {
      const updatedInfo = { ...existingInfo, ...userInfo };
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedInfo));
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error updating user info in AsyncStorage:", error);
    return false;
  }
};

export const removeLocalUserInfo = async (): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(USER_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error("Error removing user info from AsyncStorage:", error);
    return false;
  }
};
