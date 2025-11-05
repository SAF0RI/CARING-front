import * as Updates from "expo-updates";
import { useEffect } from "react";
import { Alert, AppState } from "react-native";

export function useInAppUpdates(): void {
  useEffect(() => {
    const subscription = AppState.addEventListener("change", async (state) => {
      if (state !== "active") return;
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          Alert.alert("업데이트", "새 버전이 있어요. 지금 적용할까요?", [
            { text: "나중에" },
            { text: "지금", onPress: () => Updates.reloadAsync() },
          ]);
        }
      } catch {
        // ignore transient errors
      }
    });

    return () => subscription.remove();
  }, []);
}
