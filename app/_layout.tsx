import { queries } from "@/entities";
import type { UserInfo } from "@/entities/user/api/schema";
import { Role } from "@/entities/user/api/schema";
import { getLocalUserInfo } from "@/entities/user/api/storage";
import { FcmProvider } from "@/shared/lib/fcm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import {
  Redirect,
  Slot,
  useRootNavigationState,
  useSegments,
} from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../index.css";

export default function RootLayout() {
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
