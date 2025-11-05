import * as Updates from "expo-updates";
import { useEffect } from "react";
import { Alert, AppState } from "react-native";

export function useInAppUpdates() {
  useEffect(() => {
    const sub = AppState.addEventListener("change", async (s) => {
      if (s !== "active") return;
      try {
        // 함수 존재 여부 방어
        if (
          !Updates?.checkForUpdateAsync ||
          !Updates?.fetchUpdateAsync ||
          !Updates?.reloadAsync
        )
          return;
        const res = await Updates.checkForUpdateAsync();
        if (!res?.isAvailable) return;
        await Updates.fetchUpdateAsync();
        // 프롬프트 없이 다음 실행 시 적용하려면 아래만: return;
        Alert.alert("업데이트", "새 버전이 있어요. 지금 적용할까요?", [
          { text: "나중에" },
          { text: "지금", onPress: () => Updates.reloadAsync() },
        ]);
      } catch {}
    });
    return () => sub.remove?.();
  }, []);
}
