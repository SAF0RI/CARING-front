import { queries } from "@/entities";
import { Emotion } from "@/entities/voices/api/schema";
import { emotionCharacteristics as emotionCharacteristicsMap, emotionKorMap, emotionRawColorMap } from "@/shared/lib/emotions";
import { EmotionIconComponent } from "@/shared/lib/emotions/components";
import { BackHeader, HelpButton, MainLayout } from "@/shared/ui";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

const formatDateSimple = (isoString: string) => {
    const date = new Date(isoString);
    return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, "0")}.${date.getDate().toString().padStart(2, "0")}`;
};

export default function DiaryDetailScreen() {

    const { id } = useLocalSearchParams();

    const { data: userInfo } = useQuery(queries.user.userInfo);

    console.log({ userInfo });

    const { data: diary } = useQuery({
        ...queries.voices.voiceAnalyzePreview(Number(id), userInfo?.username ?? ''),
        enabled: !!id && !!userInfo?.username,
    });


    const currentDiary = diary?.voice_id === Number(id) ? diary : null;
    const topEmotion = (currentDiary?.top_emotion ?? null) as Emotion | null;

    const emotionPercentages: Record<string, number> = currentDiary ? {
        happy: currentDiary.happy_pct ?? 0,
        neutral: currentDiary.neutral_pct ?? 0,
        surprise: currentDiary.surprise_pct ?? 0,
        sad: currentDiary.sad_pct ?? 0,
        fear: currentDiary.fear_pct ?? 0,
        angry: currentDiary.angry_pct ?? 0,
    } : {};

    const emotionCharacteristics = emotionCharacteristicsMap[topEmotion ?? 'unknown'];

    const emotionOrder: Emotion[] = ['happy', 'neutral', 'surprise', 'sad', 'fear', 'angry'];

    return (
        <MainLayout>
            <MainLayout.Header>
                <BackHeader title="일기 상세보기" rightComponent={<HelpButton />} />
            </MainLayout.Header>

            <MainLayout.Content className="bg-gray5 flex-1 p-4">
                <View className="bg-white rounded-[20px] p-6 gap-y-6">
                    <Text className="text-gray90 text-[15px] font-semibold w-full text-left">
                        {diary?.created_at ? formatDateSimple(diary.created_at) : '-'}
                    </Text>

                    <View className="flex-row items-center gap-x-2">
                        <EmotionIconComponent
                            emotion={(topEmotion ?? 'unknown')}
                            isBig={false}
                        />
                        <Text className="text-gray90 text-[19px] font-bold">
                            {userInfo?.name ?? '사용자'} 님이 {'\n'}
                            {emotionKorMap[topEmotion ?? 'unknown']} 상태예요!
                        </Text>
                    </View>

                    <View className="gap-y-3">
                        {emotionCharacteristics.map((characteristic: string, index: number) => (
                            <View
                                key={index}
                                className="bg-gray10 rounded-[12px] px-4 py-1"
                            >
                                <Text className="text-gray90 text-[15px]">
                                    {characteristic}
                                </Text>
                            </View>
                        ))}
                    </View>

                    <View className="h-px bg-gray10" />

                    <View className="gap-y-4">
                        {emotionOrder.map((emotion) => {
                            const percentage = Math.round(emotionPercentages[emotion] ?? 0);
                            const color = emotionRawColorMap[emotion] ?? "#C7C7CC";
                            const emotionName = emotionKorMap[emotion] ?? '분석 중';

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
