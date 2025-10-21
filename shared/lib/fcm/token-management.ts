import messaging from "@react-native-firebase/messaging";
import * as SecureStore from "expo-secure-store";

export const getTokenAndSaveTokenProcess = () => {
  const getTokenAndSaveToken = async () => {
    if (!(await SecureStore.getItemAsync("fcm-token"))) {
      const token = await messaging().getToken();
      await SecureStore.setItemAsync("fcm-token", token);
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
