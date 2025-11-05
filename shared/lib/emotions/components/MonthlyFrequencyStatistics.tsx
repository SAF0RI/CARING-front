import { queries } from "@/entities";
import { Role } from "@/entities/user/api/schema";
import { Emotion } from "@/entities/voices/api";
import {
  emotionKorMap,
  emotionRawColorMap,
} from "@/shared/lib/emotions/constant";
import { formatYearMonth } from "@/shared/util/format";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

export const MonthlyFrequencyStatistics = ({
  username,
  role = Role.CARE,
  isReport = true,
}: {
  username: string;
  role: Role;
  isReport?: boolean;
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const monthString = formatYearMonth(currentDate);

  console.log({ username });

  const { data: monthlyData, isFetching, isError, error } = useQuery({
    ...(role === Role.CARE
      ? queries.care.emotionMonthlyFrequency(username, monthString)
      : queries.user.monthlyFrequency(username, monthString)),
    enabled: !!username && !!role,
    refetchOnReconnect: true,
    refetchOnMount: "always",
  });

  console.log({ monthlyData });

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
  console.log({ monthString });

  const frequency = monthlyData?.frequency || {};

  const frequencyData: Record<Emotion, number> = {
    happy: frequency.happy || 0,
    surprise: frequency.surprise || 0,
    sad: frequency.sad || 0,
    neutral: frequency.neutral || 0,
    fear: frequency.fear || 0,
    angry: frequency.angry || 0,
    unknown: frequency.unknown || 0,
  };

  const maxFrequency = Math.max(...Object.values(frequencyData), 1);
  const maxYAxis = Math.ceil(maxFrequency / 5) * 5; // 5단위로 올림
  const yAxisTicks = [0, 5, 10, 15, 20].filter((tick) => tick <= maxYAxis);

  const monthlySummary = isFetching || isError
    ? "감정 빈도 통계를 불러오는 중입니다."
    : isError ? error?.message || "감정 빈도 통계를 불러오는 중에 오류가 발생했습니다."
      : monthlyData?.message || "감정 빈도 통계를 불러오는 중에 오류가 발생했습니다.";

  const emotionsForBar: Emotion[] = [
    "happy",
    "neutral",
    "surprise",
    "sad",
    "fear",
    "angry",
  ];

  return (
    <View className="bg-white rounded-[20px] p-6 gap-y-4">
      {/* 헤더 */}
      <View className="flex-row items-center justify-between mb-2">
        {isReport && (
          <TouchableOpacity
            onPress={handlePrevMonth}
            className="w-10 h-10 rounded-full bg-gray10 items-center justify-center"
          >
            <Text className="text-gray90 text-xl">‹</Text>
          </TouchableOpacity>
        )}

        <View className="items-center flex-1">
          <Text className="text-gray90 text-[20px] font-bold">
            {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
          </Text>
        </View>

        {isReport && (
          <TouchableOpacity
            onPress={handleNextMonth}
            className="w-10 h-10 rounded-full bg-gray10 items-center justify-center"
          >
            <Text className="text-gray90 text-xl">›</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 바 차트 */}
      {isFetching ? (
        <View className="h-64 items-center justify-center">
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      ) : (
        <View className="h-64">
          {/* Y축 */}
          <View className="absolute left-0 top-0 -bottom-1 justify-between">
            {[...yAxisTicks]
              .slice()
              .reverse()
              .map((tick) => (
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
              const color = emotionRawColorMap[emotion];

              return (
                <View
                  key={emotion}
                  className="flex-1 items-center justify-end relative"
                >
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
                      {emotionKorMap[emotion]}
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
        <Text className="text-gray70 text-[14px] leading-5">
          {monthlySummary}
        </Text>
      </View>
    </View>
  );
};
