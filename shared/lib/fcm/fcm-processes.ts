import { type ProcessResultMessage } from "@/shared/util/process";
import * as Notifications from "expo-notifications";

export const requestUserPermissionProcess =
  async (): Promise<ProcessResultMessage> => {
    const result = await requestUserPermission();
    return { success: result };
  };

async function requestUserPermission(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === "granted";
}
