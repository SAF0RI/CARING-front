import { queries } from "@/entities";
import { Emotion } from "@/entities/voices/api/schema";
import { formatDateRange, formatYearMonth, getWeekOfMonth, getWeekRange } from "@/shared/util/format";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { normalizeEmotion } from "../util";
import { EmotionIconComponent } from "./EmotionIconComponent";

export const WeeklyStatistics = ({ username, isReport = true }: { username: string, isReport?: boolean }) => {

    const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

    const [currentDate, setCurrentDate] = useState(new Date());
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const week = getWeekOfMonth(currentDate);

    const monthString = formatYearMonth(currentDate);
    const weekRange = getWeekRange(year, month, week);

    const { data: weeklyData, isLoading } = useQuery({
        ...queries.care.emotionWeeklySummary(username, monthString, week),
        enabled: !!username,
    });

    const handlePrevWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() - 7);
        setCurrentDate(newDate);
    };

    const handleNextWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + 7);
        setCurrentDate(newDate);
    };

    // 주차의 각 날짜 계산
    const weekDates: Date[] = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(weekRange.start);
        date.setDate(date.getDate() + i);
        weekDates.push(date);
    }

    // 새로운 API 응답 구조에 맞춰 감정 데이터 매핑
    // WeeklySummaryResponse: { weekly: [{ date: string, weekday: string, top_emotion: Emotion }] }
    const weeklyEmotions: (Emotion | null)[] = Array(7).fill(null);

    if (weeklyData?.weekly && Array.isArray(weeklyData.weekly)) {
        weeklyData.weekly.forEach((item) => {
            if (!item.date || !item.top_emotion) return;

            // 날짜 문자열로 매칭 ('YYYY-MM-DD' 형식)
            const itemDate = new Date(item.date);
            if (isNaN(itemDate.getTime())) return;

            const dayIndex = weekDates.findIndex(
                (d) =>
                    d.getFullYear() === itemDate.getFullYear() &&
                    d.getMonth() === itemDate.getMonth() &&
                    d.getDate() === itemDate.getDate()
            );

            if (dayIndex >= 0 && dayIndex < 7) {
                const emotion = normalizeEmotion(item.top_emotion);
                if (emotion) {
                    weeklyEmotions[dayIndex] = emotion;
                }
            }
        });
    }

    const weeklySummary = isLoading ? "주간 마음일기 통계를 불러오는 중입니다." : "주 초반에는 즐겁고 안정적인 날들이 많았지만, 목요일부터 감정 상태가 급격히 바뀌었네요.";

    const yAxisEmotions: Emotion[] = ["happy", "neutral", "surprise", "sad", "fear", "angry"];

    return (
        <View className="bg-white rounded-[20px] p-6 gap-y-4 mb-4">
            <View className="flex-row items-center justify-between mb-2">
                {
                    isReport && (
                        <TouchableOpacity
                            onPress={handlePrevWeek}
                            className="w-10 h-10 rounded-full bg-gray10 items-center justify-center"
                        >
                            <Text className="text-gray90 text-xl">‹</Text>
                        </TouchableOpacity>
                    )
                }

                <View className="items-center flex-1">
                    <Text className="text-gray90 text-[20px] font-bold">
                        {month}월 {week}째주
                    </Text>
                    <Text className="text-gray70 text-[14px] mt-1">
                        {formatDateRange(weekRange.start, weekRange.end)}
                    </Text>
                </View>

                {
                    isReport && (
                        <TouchableOpacity
                            onPress={handleNextWeek}
                            className="w-10 h-10 rounded-full bg-gray10 items-center justify-center"
                        >
                            <Text className="text-gray90 text-xl">›</Text>
                        </TouchableOpacity>
                    )
                }
            </View>

            {isLoading ? (
                <View className="h-64 items-center justify-center">
                    <ActivityIndicator size="large" color="#6366f1" />
                </View>
            ) : (
                <View className="h-64 relative pb-8">
                    <View className="flex-1 ml-12 mr-4 flex-row justify-between items-stretch relative" style={{ paddingBottom: 32 }}>
                        {(() => {
                            const paddingBottomRatio = 32 / 256;
                            const availableHeight = 100 - (paddingBottomRatio * 100);
                            const topLabelPercentage = (0 / (yAxisEmotions.length - 1)) * availableHeight;
                            const bottomLabelPercentage = ((yAxisEmotions.length - 1) / (yAxisEmotions.length - 1)) * availableHeight;

                            return (
                                <View
                                    className="absolute top-0"
                                    style={{
                                        left: -48,
                                        width: 48,
                                        bottom: 32,
                                    }}
                                >
                                    <Text
                                        className="absolute text-gray70 text-[12px]"
                                        style={{
                                            top: `${topLabelPercentage}%` as any,
                                            transform: [{ translateY: -10 }],
                                        }}
                                    >
                                        즐거움
                                    </Text>
                                    <Text
                                        className="absolute text-gray70 text-[12px]"
                                        style={{
                                            top: `${bottomLabelPercentage}%` as any,
                                            transform: [{ translateY: -10 }],
                                        }}
                                    >
                                        불안
                                    </Text>
                                </View>
                            );
                        })()}

                        {yAxisEmotions.map((emotion, index) => {
                            const paddingBottomRatio = 32 / 256;
                            const availableHeight = 100 - (paddingBottomRatio * 100);
                            const topPercentage = (index / (yAxisEmotions.length - 1)) * availableHeight;

                            return (
                                <View
                                    key={emotion}
                                    className="absolute left-0 right-0"
                                    style={{
                                        top: `${topPercentage}%` as any,
                                        height: 1,
                                        backgroundColor: "#E5E5E5",
                                    }}
                                />
                            );
                        })}

                        {weekDates.map((date, dayIndex) => {
                            const dayOfWeek = date.getDay();
                            const dayName = weekDays[dayOfWeek];
                            const emotion = weeklyEmotions[dayIndex];
                            const isToday =
                                date.getFullYear() === new Date().getFullYear() &&
                                date.getMonth() === new Date().getMonth() &&
                                date.getDate() === new Date().getDate();

                            const emotionIndex = emotion ? yAxisEmotions.indexOf(emotion) : -1;
                            const paddingBottom = 32;
                            const availableHeight = 100 - (paddingBottom / 256 * 100);
                            const yPosition = emotionIndex >= 0
                                ? `${(emotionIndex / (yAxisEmotions.length - 1)) * availableHeight}%`
                                : `${availableHeight / 2}%`;

                            return (
                                <View key={`${dayIndex}-${date.toISOString()}`} className="flex-1 items-center justify-center relative" style={{ minHeight: 200 }}>
                                    {emotion && (
                                        <View
                                            className="absolute items-center justify-center"
                                            style={{
                                                top: yPosition as any,
                                                transform: [{ translateY: -8 }],
                                                width: 24,
                                                height: 24,
                                            }}
                                        >
                                            <EmotionIconComponent emotion={emotion as Emotion} isBig={false} />
                                        </View>
                                    )}
                                    <View className="absolute bottom-0">
                                        <Text className="text-gray70 text-[12px] text-center">
                                            {dayName}
                                            {isToday && (
                                                <Text className="text-main700 text-[10px]">{"\n"}(오늘)</Text>
                                            )}
                                        </Text>
                                    </View>
                                </View>
                            );
                        })}

                        <View className="absolute left-0 right-0 top-0 bottom-0 pointer-events-none" />
                    </View>
                </View>
            )}

            <View className="bg-gray10 rounded-[16px] p-4 mt-2">
                <Text className="text-gray70 text-[14px] leading-5">{weeklySummary}</Text>
            </View>
        </View>
    );
}