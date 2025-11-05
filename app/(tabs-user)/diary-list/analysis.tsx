import { queries } from "@/entities";
import { Role } from "@/entities/user/api/schema";
import { MonthlyFrequencyStatistics, WeeklyStatistics } from "@/shared/lib/emotions/components";
import { BackHeader, HelpButton, MainLayout } from "@/shared/ui";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";

export default function DiaryAnalysisScreen() {
  const { data: userInfo } = useQuery(queries.user.userInfo);
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // 전체 관련 쿼리 무효화하여 재조회
      await queryClient.invalidateQueries();
    } finally {
      setRefreshing(false);
    }
  }, [queryClient]);

  return (
    <MainLayout>
      <MainLayout.Header>
        <BackHeader title="일기 분석 결과" rightComponent={<HelpButton />} />
      </MainLayout.Header>

      <MainLayout.Content className="bg-gray5 flex-1 p-4" footer={false}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <View className="items-center mb-4">
            <Text className="text-main900 text-[20px] font-bold text-center">
              나의 감정 분석 결과
            </Text>
            <Text className="text-gray70 text-[15px] mt-2 text-center">
              주간 및 월간 감정 통계를 확인해보세요
            </Text>
          </View>

          <Text className="text-gray100 text-[20px] font-bold text-left mb-4">
            주간 마음일기 통계
          </Text>
          <WeeklyStatistics username={userInfo?.username ?? ''} role={Role.USER} />
          <Text className="text-gray100 text-[20px] font-bold text-left mb-4">
            감정 빈도 통계
          </Text>
          <MonthlyFrequencyStatistics username={userInfo?.username ?? ''} role={Role.USER} />
        </ScrollView>
      </MainLayout.Content>
    </MainLayout>
  );
}
