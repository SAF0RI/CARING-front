import { type ProcessResultMessage } from "@/shared/util/process";
import messaging from "@react-native-firebase/messaging";

export const requestUserPermissionProcess =
  async (): Promise<ProcessResultMessage> => {
    const result = await requestUserPermission();
    return { success: result };
  };

async function requestUserPermission(): Promise<boolean> {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    return true;
  }
  return false;
}
