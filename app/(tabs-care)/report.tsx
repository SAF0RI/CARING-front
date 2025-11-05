import { queries } from "@/entities";
import { MonthlyFrequencyStatistics, WeeklyStatistics } from "@/shared/lib/emotions/components";
import { Footer, MainHeader, MainLayout } from "@/shared/ui";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";

export default function ReportScreen() {

    const userInfo = useQuery(queries.user.userInfo);
    const queryClient = useQueryClient();
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            const username = userInfo?.data?.username;
            await Promise.all([
                userInfo.refetch(),
                username ? Promise.all([
                    queryClient.invalidateQueries({ queryKey: queries.care._def }),
                ]) : Promise.resolve(),
            ]);
        } finally {
            setRefreshing(false);
        }
    };

    return (
        <MainLayout className="bg-gray-50">
            <MainLayout.Header>
                <MainHeader title="일기 리포트" />
            </MainLayout.Header>
            <ScrollView
                showsVerticalScrollIndicator={false}
                className="w-full"
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View className="items-center mb-4 mt-4">
                    <Text className="text-main900 text-[20px] font-bold text-center">
                        감정 분석 결과
                    </Text>
                    <Text className="text-gray70 text-[15px] mt-2 text-center">
                        주간 및 월간 감정 통계를 확인해보세요
                    </Text>
                </View>
                <View className="px-4">
                    <View className="flex-row items-center justify-between">
                        <Text className="text-gray100 text-[20px] font-bold text-left mb-4 mt-4">
                            마음일기 통계
                        </Text>
                    </View>
                    <WeeklyStatistics username={userInfo?.data?.username ?? ''} />
                    <View className="flex-row items-center justify-between">
                        <Text className="text-gray100 text-[20px] font-bold text-left mb-4 mt-4">
                            감정 빈도 통계
                        </Text>
                    </View>
                    <MonthlyFrequencyStatistics username={userInfo?.data?.username ?? ''} />
                </View>
                <Footer />
            </ScrollView>
        </MainLayout>
    );
}

