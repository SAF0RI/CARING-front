import { queries } from "@/entities";
import { Emotion } from "@/entities/voices/api/schema";
import { EmotionIconComponent } from "@/shared/lib/emotions/components";
import { emotionRawColorMap } from "@/shared/lib/emotions/constant";
import { formatDateRange, formatYearMonth, getWeekOfMonth, getWeekRange } from "@/shared/util/format";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

export const WeeklyStatistics = ({ username }: { username: string }) => {
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

    const weekDates: Date[] = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(weekRange.start);
        date.setDate(date.getDate() + i);
        weekDates.push(date);
    }

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
                const emotion = item.top_emotion;
                if (emotion) {
                    weeklyEmotions[dayIndex] = emotion;
                }
            }
        });
    }

    const weeklySummary = "주 초반에는 즐겁고 안정적인 날들이 많았지만, 목요일부터 감정 상태가 급격히 바뀌었네요.";

    // Y축 감정 (위에서 아래로: 즐거움 -> 불안)
    const yAxisEmotions: Emotion[] = ["happy", "neutral", "surprise", "sad", "fear", "angry"];

    return (
        <View className="bg-white rounded-[20px] p-6 gap-y-4 mb-4">
            {/* 헤더 */}
            <View className="flex-row items-center justify-between mb-2">
                <TouchableOpacity
                    onPress={handlePrevWeek}
                    className="w-10 h-10 rounded-full bg-gray10 items-center justify-center"
                >
                    <Text className="text-gray90 text-xl">‹</Text>
                </TouchableOpacity>

                <View className="items-center flex-1">
                    <Text className="text-gray90 text-[20px] font-bold">
                        {month}월 {week}째주
                    </Text>
                    <Text className="text-gray70 text-[14px] mt-1">
                        {formatDateRange(weekRange.start, weekRange.end)}
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={handleNextWeek}
                    className="w-10 h-10 rounded-full bg-gray10 items-center justify-center"
                >
                    <Text className="text-gray90 text-xl">›</Text>
                </TouchableOpacity>
            </View>

            {/* 그래프 */}
            {isLoading ? (
                <View className="h-64 items-center justify-center">
                    <ActivityIndicator size="large" color="#6366f1" />
                </View>
            ) : (
                <View className="h-64 relative">
                    {/* Y축 레이블 */}
                    <View className="absolute left-0 top-0 h-full justify-between py-2">
                        <Text className="text-gray70 text-[12px]">즐거움</Text>
                        <Text className="text-gray70 text-[12px]">불안</Text>
                    </View>

                    {/* 그래프 영역 */}
                    <View className="flex-1 ml-12 mr-4 flex-row justify-between items-stretch relative">
                        {/* Y축 감정 위치 선 (시각적 가이드) */}
                        {yAxisEmotions.map((emotion, index) => (
                            <View
                                key={emotion}
                                className="absolute le  ft-0 right-0"
                                style={{
                                    top: `${(index / (yAxisEmotions.length - 1)) * 100}%` as any,
                                    height: 1,
                                    backgroundColor: "#E5E5E5",
                                }}
                            />
                        ))}

                        {/* 각 요일별 데이터 */}
                        {weekDates.map((date, dayIndex) => {
                            const dayOfWeek = date.getDay();
                            const dayName = weekDays[dayOfWeek];
                            const emotion = weeklyEmotions[dayIndex];
                            const isToday =
                                date.getFullYear() === new Date().getFullYear() &&
                                date.getMonth() === new Date().getMonth() &&
                                date.getDate() === new Date().getDate();

                            // 감정의 Y축 위치 계산
                            const emotionIndex = emotion ? yAxisEmotions.indexOf(emotion) : -1;
                            const yPosition = emotionIndex >= 0
                                ? `${(emotionIndex / (yAxisEmotions.length - 1)) * 100}%`
                                : "50%";

                            return (
                                <View key={`${dayIndex}-${date.toISOString()}`} className="flex-1 items-center justify-center relative" style={{ minHeight: 200 }}>
                                    {/* 감정 아이콘 */}
                                    {emotion && emotion !== "angry" && (
                                        <View
                                            className="absolute items-center justify-center"
                                            style={{
                                                top: yPosition as any,
                                                transform: [{ translateY: -10 }],
                                                width: 24,
                                                height: 24,
                                            }}
                                        >
                                            <EmotionIconComponent emotion={emotion as Emotion} isBig={false} />
                                        </View>
                                    )}
                                    {/* 분노 감정은 특별 처리 (현재 아이콘이 없음) */}
                                    {emotion === "angry" && (
                                        <View
                                            className="absolute w-5 h-5 rounded-full items-center justify-center"
                                            style={{
                                                top: yPosition as any,
                                                transform: [{ translateY: -10 }],
                                                backgroundColor: emotionRawColorMap.angry,
                                            }}
                                        >
                                            <Text className="text-white text-[10px] font-bold">분</Text>
                                        </View>
                                    )}

                                    {/* 요일 레이블 */}
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

                        {/* 연결선 (선택적) */}
                        <View className="absolute left-0 right-0 top-0 bottom-0 pointer-events-none">
                            {/* 여기에 점선 연결선을 그릴 수 있습니다 */}
                        </View>
                    </View>
                </View>
            )}

            {/* 주간 요약 */}
            <View className="bg-gray10 rounded-[16px] p-4 mt-2">
                <Text className="text-gray70 text-[14px] leading-5">{weeklySummary}</Text>
            </View>
        </View>
    );
}