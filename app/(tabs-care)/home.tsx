import { queries } from "@/entities";
import { emotionBgColorMap, emotionKorMap } from "@/shared/lib/emotions";
import { EmotionIconComponent, MonthlyFrequencyStatistics, WeeklyStatistics } from "@/shared/lib/emotions/components";
import { Footer, MainHeader, MainLayout, RingButton } from "@/shared/ui";
import { Icon } from "@/shared/ui/svg";
import { cn } from "@/shared/util/style";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";



export default function HomeScreen() {

    const userInfo = useQuery(queries.user.userInfo);
    const router = useRouter();
    const queryClient = useQueryClient();
    const [refreshing, setRefreshing] = useState(false);

    const { data: topEmotion, refetch: topEmotionRefetch } = useQuery({
        ...queries.care.topEmotion(userInfo?.data?.username ?? ''),
        enabled: !!userInfo?.data?.user_code,
    });

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            const username = userInfo?.data?.username;
            await Promise.all([
                topEmotionRefetch(),
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
                <MainHeader title="홈" rightComponent={<RingButton number={1} onPress={() => router.push("/(notifications)")} />} />
            </MainLayout.Header>
            <ScrollView
                showsVerticalScrollIndicator={false}
                className="w-full"
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* 상단 감정 컴포넌트 */}
                <View className={cn(['flex-row w-full h-[172px] bg-main50 flex items-center justify-center rounded-b-[20px] px-4', emotionBgColorMap['fear']])}>
                    <EmotionIconComponent emotion={topEmotion?.top_emotion ?? 'unknown'} isBig={true} />
                    <View className="flex-col items-start justify-center mx-4 gap-y-1">
                        <Text className="text-gray90 text-[19px]">{`오늘 ${topEmotion?.user_name ?? ''}님이`}</Text>
                        <Text className="text-gray90 text-[19px] font-bold">{`${emotionKorMap[topEmotion?.top_emotion ?? 'unknown']} 상태에요!`}</Text>
                    </View>
                    <TouchableOpacity
                        className="flex-row items-center justify-center bg-gray90 rounded-full px-4 py-2"
                        onPress={() => router.push("/diary-list")}
                    >
                        <Text className="text-gray1 text-[17px] font-semibold">{`확인하기`}</Text>
                        <Icon name="ChevronRightWhite" size={24} />
                    </TouchableOpacity>
                </View>
                <View className="px-4">
                    <View className="flex-row items-center justify-between">
                        <Text className="text-gray100 text-[20px] font-bold text-left mb-4 mt-4">
                            주간 마음일기 통계
                        </Text>
                        <TouchableOpacity
                            className="flex-row items-center justify-center rounded-full px-4 py-2"
                            onPress={() => router.push("/report")}
                        >
                            <Text className="text-black text-[17px] font-semibold">자세히 보기</Text>
                            <Icon name="ChevronRightBlack" size={24} />
                        </TouchableOpacity>
                    </View>
                    <WeeklyStatistics username={userInfo?.data?.username ?? ''} isReport={false} />
                    <View className="flex-row items-center justify-between">
                        <Text className="text-gray100 text-[20px] font-bold text-left mb-4 mt-4">
                            감정 빈도 통계
                        </Text>
                        <TouchableOpacity
                            className="flex-row items-center justify-center rounded-full px-4 py-2"
                            onPress={() => router.push("/report")}
                        >
                            <Text className="text-black text-[17px] font-semibold">자세히 보기</Text>
                            <Icon name="ChevronRightBlack" size={24} />
                        </TouchableOpacity>
                    </View>
                    <MonthlyFrequencyStatistics username={userInfo?.data?.username ?? ''} isReport={false} />
                </View>
                <Footer />
            </ScrollView>

        </MainLayout>
    );
}

