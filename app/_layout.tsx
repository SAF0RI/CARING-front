import { queries } from "@/entities";
import type { UserInfo } from "@/entities/user/api/schema";
import { Role } from "@/entities/user/api/schema";
import { getLocalUserInfo } from "@/entities/user/api/storage";
import { FcmProvider } from "@/shared/lib/fcm";
import { useInAppUpdates } from "@/shared/lib/useInAppUpdates";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import {
  Redirect,
  Slot,
  useRootNavigationState,
  useSegments,
} from "expo-router";
import * as Updates from "expo-updates";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Image, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../index.css";

export default function RootLayout() {

  useInAppUpdates();
  const [isBootUpdating, setIsBootUpdating] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const segments = useSegments();
  const navigationState = useRootNavigationState();

  const inAuthGroup = segments[0] === "(auth)";

  // QueryClient를 메모이제이션하여 앱이 재시작될 때마다 새로 생성되지 않도록 함
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
          mutations: {
            onMutate: (variables) => {
              console.log("[RQ][Mutation][Request]", variables);
            },
            onSuccess: (data, variables) => {
              console.log("[RQ][Mutation][Response]", { data, variables });
            },
            onError: (error, variables) => {
              console.log(error, "error");
              if (isAxiosError(error)) {
                Alert.alert(
                  "오류",
                  error.response?.data?.message ??
                  "알 수 없는 오류가 발생했습니다."
                );
              } else {
                Alert.alert(
                  "오류",
                  error.message ?? "알 수 없는 오류가 발생했습니다."
                );
              }
              //console.log("[RQ][Mutation][Error]", { error, variables });
            },
          },
        },
      }),
    []
  );

  // 앱 초기 렌더 차단: 업데이트가 있으면 다운로드 후 즉시 재시작
  useEffect(() => {
    (async () => {
      try {
        if (
          !Updates?.checkForUpdateAsync ||
          !Updates?.fetchUpdateAsync ||
          !Updates?.reloadAsync
        )
          return;
        const res = await Updates.checkForUpdateAsync();
        if (res?.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
          return;
        }
      } finally {
        setIsBootUpdating(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const info = await getLocalUserInfo();
        setUserInfo(info);

        // 로드된 userInfo를 React Query 캐시에 초기 데이터로 설정
        if (info) {
          queryClient.setQueryData(queries.user.userInfo.queryKey, info);
        }
      } finally {
        setIsLoadingUser(false);
      }
    })();
  }, [queryClient]);

  if (isBootUpdating)
    return (
      <SafeAreaProvider>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            paddingHorizontal: 24,
          }}
        >
          <Image
            source={require("../assets/images/img_logo_header.png")}
            style={{ width: 120, height: 120, resizeMode: "contain" }}
          />
          <ActivityIndicator size="small" />
          <Text style={{ fontSize: 14, color: "#666" }}>
            자동 업데이트 확인중...
          </Text>
        </View>
      </SafeAreaProvider>
    );
  if (!navigationState?.key) return null;
  if (isLoadingUser) return null;

  if (!userInfo && !inAuthGroup) {
    return <Redirect href="/(auth)/login" />;
  }
  if (userInfo && inAuthGroup) {
    // 역할에 따라 적절한 탭 그룹으로 리다이렉트
    if (userInfo.role === Role.CARE) {
      return <Redirect href="/(tabs-care)/home" />;
    }
    return <Redirect href="/(tabs-user)/diary-list" />;
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <FcmProvider>
          <Slot />
        </FcmProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
