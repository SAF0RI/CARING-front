import { usePathname } from "expo-router";
import * as Updates from "expo-updates";
import { useEffect, useRef } from "react";
import { Alert, AppState } from "react-native";

export function useInAppUpdates() {
  const pathname = usePathname();
  const lastCheckMsRef = useRef(0);
  const COOLDOWN_MS = 5 * 60 * 1000; // 5분

  async function checkAndPrompt() {
    try {
      if (
        !Updates?.checkForUpdateAsync ||
        !Updates?.fetchUpdateAsync ||
        !Updates?.reloadAsync
      )
        return;
      const now = Date.now();
      if (now - lastCheckMsRef.current < COOLDOWN_MS) return;
      lastCheckMsRef.current = now;

      const res = await Updates.checkForUpdateAsync();
      if (!res?.isAvailable) return;
      await Updates.fetchUpdateAsync();
      Alert.alert("업데이트", "새 버전이 있어요. 지금 적용할까요?", [
        { text: "나중에" },
        { text: "지금", onPress: () => Updates.reloadAsync() },
      ]);
    } catch {}
  }

  // 포그라운드 복귀 시
  useEffect(() => {
    const sub = AppState.addEventListener("change", async (s) => {
      if (s === "active") await checkAndPrompt();
    });
    return () => sub.remove?.();
  }, []);

  // 라우트 변경 시
  useEffect(() => {
    checkAndPrompt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
}
