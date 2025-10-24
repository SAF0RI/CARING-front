import { FcmProvider } from '@/shared/lib/fcm';
import { useAuthStore } from "@/shared/model/store/authStore";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Redirect, Slot, useRootNavigationState, useSegments } from "expo-router";

export default function RootLayout() {

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  if (!navigationState?.key) return null;

  const inAuthGroup = segments[0] === "(auth)";
  if (!isAuthenticated && !inAuthGroup) {
    return <Redirect href="/(auth)/login" />;
  }
  if (isAuthenticated && inAuthGroup) {
    return <Redirect href="/(tabs)/diary-list" />;
  }
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <FcmProvider>
        <Slot />
      </FcmProvider>
    </QueryClientProvider >
  );
}