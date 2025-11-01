import { queries } from "@/entities";
import { Emotion } from "@/entities/voices/api/schema";
import { EmotionIconComponent } from "@/shared/lib/emotions/components/EmotionIconComponent";
import { BackHeader, HelpButton, MainLayout } from "@/shared/ui";
import { formatDateRange, formatYearMonth, getWeekOfMonth, getWeekRange } from "@/shared/util/format";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";


const normalizeEmotion = (raw?: string): Emotion | null => {
  console.log({ raw })
  if (!raw) return null;
  const v = String(raw).trim().toLowerCase();
  // 영어
  if (["happy", "joy", "joyful"].includes(v)) return "happy";
  if (["calm", "stable", "peace", "peaceful", "stability"].includes(v)) return "calm";
  if (["surprise", "surprised"].includes(v)) return "surprise";
  if (["sad", "sadness"].includes(v)) return "sad";
  if (["anxiety", "anxious", "fear"].includes(v)) return "anxiety";
  if (["anger", "angry", "rage"].includes(v)) return "anger";
  // 한국어
  if (["즐거움", "기쁨"].includes(raw)) return "happy";
  if (["평온", "안정"].includes(raw)) return "calm";
  if (["놀람"].includes(raw)) return "surprise";
  if (["슬픔"].includes(raw)) return "sad";
  if (["불안"].includes(raw)) return "anxiety";
  if (["분노"].includes(raw)) return "anger";
  return null;
};

// 감정 한글 이름
const emotionNames: Record<Emotion, string> = {
  happy: "즐거움",
  calm: "평온",
  surprise: "놀람",
  sad: "슬픔",
  anxiety: "불안",
  anger: "분노",
  unknown: "알 수 없음",
};

// 감정 색상 (그래프용)
const emotionColors: Record<Emotion, string> = {
  happy: "#FF9500", // 오렌지
  calm: "#34C759", // 초록
  surprise: "#FFCC00", // 노랑
  sad: "#007AFF", // 파랑
  anxiety: "#FF6B6B", // 주황빨강
  anger: "#FF3B30", // 빨강
  unknown: "#8E8E93", // 회색
};

// 요일 배열
const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

// 주간 통계 컴포넌트
function WeeklyStatistics({ username }: { username: string }) {
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

// 월간 빈도 통계 컴포넌트
function MonthlyFrequencyStatistics({ username }: { username: string }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const monthString = formatYearMonth(currentDate);

  const { data: monthlyData, isLoading } = useQuery({
    ...queries.care.emotionMonthlyFrequency('care', monthString),
    //enabled: !!username,
  });

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };


  const frequency = monthlyData?.frequency || {};

  const frequencyData: Record<Emotion, number> = {
    happy: frequency.happy || 0,
    calm: frequency.calm || 0,
    surprise: frequency.surprise || 0,
    sad: frequency.sad || 0,
    anxiety: frequency.anxiety || 0,
    anger: frequency.angry || 0, // API에서는 "angry"로 옴
    unknown: frequency.unknown || 0,
  };

  console.log("Parsed frequencyData:", frequencyData);

  const maxFrequency = Math.max(...Object.values(frequencyData), 1);
  const maxYAxis = Math.ceil(maxFrequency / 5) * 5; // 5단위로 올림
  const yAxisTicks = [0, 5, 10, 15, 20].filter(tick => tick <= maxYAxis);

  // 월간 요약 생성 (빈도 데이터 기반)
  const generateMonthlySummary = () => {
    const total = Object.values(frequencyData).reduce((sum, val) => sum + val, 0);
    if (total === 0) {
      return `${currentDate.getMonth() + 1}월에는 아직 감정 데이터가 없습니다.`;
    }

    const sortedEmotions = Object.entries(frequencyData)
      .filter(([_, count]) => count > 0)
      .sort(([_, a], [__, b]) => b - a)
      .map(([emotion, _]) => emotion);

    if (sortedEmotions.length === 0) {
      return `${currentDate.getMonth() + 1}월에는 감정 데이터가 없습니다.`;
    }

    const topEmotion = sortedEmotions[0];
    const topCount = frequencyData[topEmotion as Emotion];

    let summary = `${currentDate.getMonth() + 1}월에는 `;

    if (topEmotion === "calm" && topCount >= total * 0.5) {
      summary += "평온하고 안정적인 마음으로 대부분의 시간을 보내셨네요!";
    } else if (topEmotion === "happy" && topCount >= total * 0.5) {
      summary += "즐거운 감정이 주를 이루었네요!";
    } else if (sortedEmotions.includes("sad") || sortedEmotions.includes("anxiety") || sortedEmotions.includes("anger")) {
      summary += "다양한 감정을 경험하셨습니다. ";
      const negativeEmotions = sortedEmotions.filter(e => ["sad", "anxiety", "anger"].includes(e));
      if (negativeEmotions.length > 0) {
        summary += `슬픔, 불안과 같은 감정 외에도 ${negativeEmotions.includes("anger") ? "분노를 포함한 " : ""}힘든 감정들이 일부 감지되었습니다.`;
      }
    } else {
      summary += "다양한 감정을 경험하셨네요.";
    }

    return summary;
  };

  const monthlySummary = generateMonthlySummary();

  const emotionsForBar: Emotion[] = ["happy", "calm", "surprise", "sad", "anxiety", "anger"];

  return (
    <View className="bg-white rounded-[20px] p-6 gap-y-4">
      {/* 헤더 */}
      <View className="flex-row items-center justify-between mb-2">
        <TouchableOpacity
          onPress={handlePrevMonth}
          className="w-10 h-10 rounded-full bg-gray10 items-center justify-center"
        >
          <Text className="text-gray90 text-xl">‹</Text>
        </TouchableOpacity>

        <View className="items-center flex-1">
          <Text className="text-gray90 text-[20px] font-bold">
            {currentDate.getMonth() + 1}월
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleNextMonth}
          className="w-10 h-10 rounded-full bg-gray10 items-center justify-center"
        >
          <Text className="text-gray90 text-xl">›</Text>
        </TouchableOpacity>
      </View>

      {/* 바 차트 */}
      {isLoading ? (
        <View className="h-64 items-center justify-center">
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      ) : (
        <View className="h-64">
          {/* Y축 */}
          <View className="absolute left-0 top-0 bottom-8 justify-between">
            {yAxisTicks.map((tick) => (
              <Text key={tick} className="text-gray70 text-[12px]">
                {tick}
              </Text>
            ))}
          </View>

          {/* 차트 영역 */}
          <View className="flex-1 ml-8 mr-4 flex-row justify-between items-end relative">
            {/* 격자선 */}
            {yAxisTicks.map((tick) => (
              <View
                key={tick}
                className="absolute left-0 right-0"
                style={{
                  bottom: `${(tick / maxYAxis) * 100}%` as any,
                  height: 1,
                  backgroundColor: "#E5E5E5",
                }}
              />
            ))}

            {/* 바 차트 */}
            {emotionsForBar.map((emotion) => {
              const frequency = frequencyData[emotion];
              const heightPercent = (frequency / maxYAxis) * 100;
              const color = emotionColors[emotion];

              return (
                <View key={emotion} className="flex-1 items-center justify-end relative">
                  {/* 바 */}
                  <View
                    className="w-full rounded-t-[4px]"
                    style={{
                      height: `${heightPercent}%`,
                      backgroundColor: color,
                      minHeight: frequency > 0 ? 4 : 0,
                    }}
                  />

                  {/* 빈도 수치 */}
                  {frequency > 0 && (
                    <View
                      className="absolute mb-1"
                      style={{
                        bottom: `${heightPercent}%`,
                      }}
                    >
                      <Text className="text-gray90 text-[12px] font-semibold">
                        {frequency}
                      </Text>
                    </View>
                  )}

                  {/* 감정 레이블 */}
                  <View className="absolute -bottom-6 w-full">
                    <Text className="text-gray70 text-[11px] text-center">
                      {emotionNames[emotion]}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* 월간 요약 */}
      <View className="bg-gray10 rounded-[16px] p-4 mt-6">
        <Text className="text-gray70 text-[14px] leading-5">{monthlySummary}</Text>
      </View>
    </View>
  );
}

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
          <WeeklyStatistics username={username} />
          <Text className="text-gray100 text-[20px] font-bold text-left mb-4">
            감정 빈도 통계
          </Text>
          <MonthlyFrequencyStatistics username={username} />
        </ScrollView>
      </MainLayout.Content>
    </MainLayout>
  );
}
