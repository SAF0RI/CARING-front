import type { UserInfo } from "@/entities/user/api/schema";
import { getLocalUserInfo } from "@/entities/user/api/storage";
import { FcmProvider } from '@/shared/lib/fcm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Redirect, Slot, useRootNavigationState, useSegments } from "expo-router";
import { useEffect, useState } from 'react';
import "../index.css";

export default function RootLayout() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const segments = useSegments();
  const navigationState = useRootNavigationState();

  const inAuthGroup = segments[0] === "(auth)";

  useEffect(() => {
    (async () => {
      try {
        const info = await getLocalUserInfo();
        setUserInfo(info);
      } finally {
        setIsLoadingUser(false);
      }
    })();
  }, []);

  if (!navigationState?.key) return null;
  if (isLoadingUser) return null;

  if (!userInfo && !inAuthGroup) {
    return <Redirect href="/(auth)/login" />;
  }
  if (userInfo && inAuthGroup) {
    return <Redirect href="/(tabs)/diary-list" />;
  }
  const queryClient = new QueryClient({
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
          console.log("[RQ][Mutation][Error]", { error, variables });
        },
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <FcmProvider>
        <Slot />
      </FcmProvider>
    </QueryClientProvider >
  );
}