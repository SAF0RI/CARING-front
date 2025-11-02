import { queries } from "@/entities";
import { deleteUserVoice } from "@/entities/voices/api/handler";
import { Emotion } from "@/entities/voices/api/schema";
import { emotionCharacteristics as emotionCharacteristicsMap, emotionKorMap } from "@/shared/lib/emotions";
import { EmotionIconComponent } from "@/shared/lib/emotions/components";
import { BackHeader, HelpButton, MainLayout } from "@/shared/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Text, View } from "react-native";

const getEmotionPercentages = (topEmotion?: Emotion | null): Record<string, number> => {
    const basePercentages: Record<string, number> = {
        happy: 40,
        calm: 30,
        surprise: 20,
        sad: 3,
        anxiety: 5,
        anger: 2,
    };

    // top_emotion에 따라 비율 조정
    if (topEmotion && topEmotion !== "unknown") {
        const adjusted = { ...basePercentages };
        // top_emotion의 비율을 높이고 나머지 조정
        adjusted[topEmotion] = Math.max(adjusted[topEmotion] || 40, 40);

        // 총합이 100이 되도록 나머지 조정
        const total = Object.values(adjusted).reduce((sum, val) => sum + val, 0);
        const targetTotal = 100;
        const ratio = targetTotal / total;

        Object.keys(adjusted).forEach((key) => {
            if (key !== topEmotion) {
                adjusted[key] = Math.round(adjusted[key] * ratio);
            }
        });

        // 마지막으로 top_emotion을 조정하여 총합이 정확히 100이 되도록
        const otherTotal = Object.keys(adjusted).reduce((sum, key) => {
            return key !== topEmotion ? sum + adjusted[key] : sum;
        }, 0);
        adjusted[topEmotion] = targetTotal - otherTotal;

        return adjusted;
    }

    return basePercentages;
};
// 감정 색상 매핑
const getEmotionColor = (emotion: string): string => {
    const colors: Record<string, string> = {
        happy: "#FF9500",      // 주황색
        calm: "#8E8E93",       // 짙은 회색
        surprise: "#FFCC00",   // 노란색 (중간 회색 대신)
        sad: "#C7C7CC",       // 옅은 회색
        anxiety: "#C7C7CC",   // 옅은 회색
        anger: "#C7C7CC",      // 옅은 회색
    };
    return colors[emotion] ?? "#C7C7CC";
};

// 날짜 포맷 변경 (2025.10.31 형식)
const formatDateSimple = (isoString: string) => {
    const date = new Date(isoString);
    return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, "0")}.${date.getDate().toString().padStart(2, "0")}`;
};

export default function DiaryDetailScreen() {

    const { id } = useLocalSearchParams();

    const { data: userInfo } = useQuery(queries.user.userInfo);

    const { data: diary } = useQuery({
        ...queries.voices.userVoiceDetail(Number(id), userInfo?.username ?? ''),
        enabled: !!id && !!userInfo?.username,
    });

    const currentDiary = diary?.voice_id === Number(id) ? diary : null;
    const topEmotion = (currentDiary?.top_emotion ?? null) as Emotion | null;
    const emotionPercentages = getEmotionPercentages(topEmotion);
    const emotionCharacteristics = emotionCharacteristicsMap[topEmotion ?? 'unknown'];

    const [isModalVisible, setIsModalVisible] = useState(false);

    const queryClient = useQueryClient();

    const { mutate: deleteDiary, isPending: isDeleting } = useMutation({
        mutationFn: () => deleteUserVoice(Number(id), userInfo?.username ?? ''),
        onError: () => {
            Alert.alert('오류', '일기 삭제 중 오류가 발생했습니다.');
        },
        onSettled: () => {
            setIsModalVisible(false);
            router.replace('/diary-list');
            queryClient.invalidateQueries(queries.voices.userVoiceList(userInfo?.username ?? ''));
        }
    });

    // 감정 순서 정의
    const emotionOrder = ['happy', 'calm', 'surprise', 'sad', 'anxiety', 'anger'] as const;

    return (
        <MainLayout>
            <MainLayout.Header>
                <BackHeader title="일기 상세보기" rightComponent={<HelpButton />} />
            </MainLayout.Header>

            <MainLayout.Content className="bg-gray5 flex-1 p-4">
                <View className="bg-white rounded-[20px] p-6 gap-y-6">
                    {/* 상단 섹션: 날짜 */}
                    <Text className="text-gray90 text-[15px] font-semibold w-full text-left">
                        {currentDiary?.created_at ? formatDateSimple(currentDiary.created_at) : '-'}
                    </Text>

                    {/* 상단 섹션: 감정 상태 메시지 */}
                    <View className="flex-row items-center gap-x-2">
                        <EmotionIconComponent
                            emotion={(topEmotion ?? 'unknown')}
                            isBig={false}
                        />
                        <Text className="text-gray90 text-[19px] font-bold">
                            {userInfo?.name ?? '사용자'} 님이 {emotionKorMap[topEmotion ?? 'unknown']} 상태예요!
                        </Text>
                    </View>

                    {/* 중간 섹션: 감정 특징 */}
                    <View className="gap-y-3">
                        {emotionCharacteristics.map((characteristic: string, index: number) => (
                            <View
                                key={index}
                                className="bg-gray10 rounded-[12px] px-4 py-3"
                            >
                                <Text className="text-gray90 text-[15px]">
                                    {characteristic}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {/* 구분선 */}
                    <View className="h-px bg-gray10" />

                    {/* 하단 섹션: 감정 비율 분석 */}
                    <View className="gap-y-4">
                        {emotionOrder.map((emotion) => {
                            const percentage = emotionPercentages[emotion] ?? 0;
                            const color = getEmotionColor(emotion);
                            const emotionName = emotionKorMap[emotion as Emotion] ?? '분석 중';

                            return (
                                <View key={emotion} className="flex-row items-center gap-x-3">
                                    <Text className="text-gray90 text-[15px] font-semibold w-16">
                                        {emotionName}
                                    </Text>
                                    <View className="flex-1 h-6 bg-gray10 rounded-full overflow-hidden">
                                        <View
                                            style={{
                                                width: `${percentage}%`,
                                                backgroundColor: color,
                                                height: '100%',
                                            }}
                                        />
                                    </View>
                                    <Text className="text-gray90 text-[15px] font-semibold w-12 text-right">
                                        {percentage}%
                                    </Text>
                                </View>
                            );
                        })}
                    </View>


                </View>
            </MainLayout.Content>
        </MainLayout >
    );
}
