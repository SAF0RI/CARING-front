import { queries } from "@/entities";
import { Emotion } from "@/entities/voices/api/schema";
import { EmotionIconComponent } from "@/shared/lib/emotions/components/EmotionIconComponent";
import { normalizeEmotion } from "@/shared/lib/emotions/util";
import { formatDateRange, formatYearMonth, getWeekOfMonth, getWeekRange } from "@/shared/util/format";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

export const WeeklyStatistics = ({ username }: { username: string }) => {
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

    // 주간 감정 데이터 (API 응답 구조에 맞게 조정)
    // 허용 포맷 예) { emotions | data | days }: Array<{ date?: string; day?: number|string; emotion?: string }>
    const weeklyEmotions: (Emotion | null)[] = Array(7).fill(null);

    // API 응답 구조 확인 및 디버깅
    console.log("=== Weekly Statistics Debug ===");
    console.log("weeklyData:", JSON.stringify(weeklyData, null, 2));
    console.log("weekDates:", weekDates.map(d => d.toISOString().split('T')[0]));

    const weeklyItems: any[] =
        (Array.isArray(weeklyData?.emotions) && weeklyData?.emotions) ||
        (Array.isArray(weeklyData?.data) && weeklyData?.data) ||
        (Array.isArray(weeklyData?.days) && weeklyData?.days) ||
        [];

    console.log("weeklyItems:", weeklyItems);

    // 데이터가 없으면 테스트 데이터 사용 (개발 중 디버깅용)
    if (weeklyItems.length === 0) {
        console.log("No data from API, using test data");
        // 테스트 데이터: 각 요일에 샘플 감정 할당
        const testEmotions: Emotion[] = ["happy", "sad", "happy", "calm", "sad", "anxiety", "calm"];
        testEmotions.forEach((emotion, idx) => {
            weeklyEmotions[idx] = emotion;
        });
    } else {
        weeklyItems.forEach((item: any) => {
            let dayIndex = -1;

            // 1) 날짜 문자열로 매칭
            if (item?.date) {
                const itemDate = new Date(item.date);
                if (!isNaN(itemDate as any)) {
                    dayIndex = weekDates.findIndex(
                        (d) =>
                            d.getFullYear() === itemDate.getFullYear() &&
                            d.getMonth() === itemDate.getMonth() &&
                            d.getDate() === itemDate.getDate()
                    );
                }
            }

            // 2) 요일 인덱스(0~6) 혹은 1~7을 사용하는 경우
            if (dayIndex === -1 && typeof item?.day === "number") {
                if (item.day >= 0 && item.day < 7) dayIndex = item.day;
                else if (item.day >= 1 && item.day <= 7) dayIndex = item.day - 1;
            }

            // 3) 요일 문자열("일","월","화"... / "sun","mon"...)
            if (dayIndex === -1 && typeof item?.day === "string") {
                const mapKo: Record<string, number> = { 일: 0, 월: 1, 화: 2, 수: 3, 목: 4, 금: 5, 토: 6 };
                const mapEn: Record<string, number> = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
                const key = item.day.trim().toLowerCase();
                if (key in mapKo) dayIndex = mapKo[key];
                if (key in mapEn) dayIndex = mapEn[key];
            }

            if (dayIndex >= 0 && dayIndex < 7) {
                const emotion = normalizeEmotion(item?.emotion);
                console.log(`Mapped dayIndex ${dayIndex}: emotion ${item?.emotion} -> ${emotion}`);
                if (emotion) weeklyEmotions[dayIndex] = emotion;
            }
        });
    }

    console.log("Final weeklyEmotions:", weeklyEmotions);

    const weeklySummary = weeklyData?.summary || "주 초반에는 즐겁고 안정적인 날들이 많았지만, 목요일부터 감정 상태가 급격히 바뀌었네요.";

    // Y축 감정 (위에서 아래로: 즐거움 -> 불안)
    const yAxisEmotions: Emotion[] = ["happy", "calm", "surprise", "sad", "anxiety", "anger"];

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
                                className="absolute left-0 right-0"
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
                                    {emotion && emotion !== "anger" && (
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
                                    {emotion === "anger" && (
                                        <View
                                            className="absolute w-5 h-5 rounded-full items-center justify-center"
                                            style={{
                                                top: yPosition as any,
                                                transform: [{ translateY: -10 }],
                                                backgroundColor: emotionColors.anger,
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