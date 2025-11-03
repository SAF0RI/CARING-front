import { queries } from "@/entities";
import { Role } from "@/entities/user/api/schema";
import { MonthlyFrequencyStatistics, WeeklyStatistics } from "@/shared/lib/emotions/components";
import { BackHeader, HelpButton, MainLayout } from "@/shared/ui";
import { useQuery } from "@tanstack/react-query";
import { ScrollView, Text, View } from "react-native";

export default function DiaryAnalysisScreen() {
  const { data: userInfo } = useQuery(queries.user.userInfo);
  const username = userInfo?.username || "";

  return (
    <MainLayout>
      <MainLayout.Header>
        <BackHeader title="일기 분석 결과" rightComponent={<HelpButton />} />
      </MainLayout.Header>

      <MainLayout.Content className="bg-gray5 flex-1 p-4" footer={false}>
        <ScrollView showsVerticalScrollIndicator={false}>
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
          <WeeklyStatistics username={username} role={Role.CARE} />
          <Text className="text-gray100 text-[20px] font-bold text-left mb-4">
            감정 빈도 통계
          </Text>
          <MonthlyFrequencyStatistics username={username} role={Role.CARE} />
        </ScrollView>
      </MainLayout.Content>
    </MainLayout>
  );
}
