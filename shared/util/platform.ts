import { Platform } from "react-native";

export const executeByPlatform = ({
  android,
  ios,
}: {
  android: () => void;
  ios: () => void;
}) => {
  if (Platform.OS === "android") {
    android();
  } else {
    ios();
  }
};
