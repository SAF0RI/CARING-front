import { queries } from "@/entities";
import { Role } from "@/entities/user/api/schema";
import { Emotion } from "@/entities/voices/api/schema";
import {
  formatDateRange,
  formatYearMonth,
  getWeekOfMonth,
  getWeekRange,
} from "@/shared/util/format";
import { useFocusEffect } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { normalizeEmotion } from "../util";
import { EmotionIconComponent } from "./EmotionIconComponent";

export const WeeklyStatistics = ({
  username,
  role = Role.CARE,
  isReport = true,
}: {
  username: string;
  role?: Role;
  isReport?: boolean;
}) => {
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const week = getWeekOfMonth(currentDate);

  const monthString = formatYearMonth(currentDate);
  const weekRange = getWeekRange(year, month, week);

  const {
    data: weeklyData,
    isFetching,
    refetch,
  } = useQuery<any>({
    ...(role === Role.CARE
      ? (queries.care.emotionWeeklySummary(username, monthString, week) as any)
      : (queries.user.weeklySummary(username, monthString, week) as any)),
    enabled: !!username && !!role,
    refetchOnReconnect: true,
    refetchOnMount: "always",
  } as any);

  // 화면 포커스 시 최신 데이터로 재조회
  useFocusEffect(
    useCallback(() => {
      if (username && role) {
        refetch();
      }
    }, [username, role, refetch])
  );

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

  const weekdaysOrder: number[] = [0, 1, 2, 3, 4, 5, 6];

  const weeklyEmotions: (Emotion | null)[] = Array(7).fill(null);

  if (weeklyData?.weekly && Array.isArray(weeklyData.weekly)) {
    weeklyData.weekly.forEach((item: any) => {
      if (!item.date || !item.top_emotion) return;

      const itemDate = new Date(item.date);
      if (isNaN(itemDate.getTime())) return;

      // 요일 기준으로 배치 (0=일 ~ 6=토)
      const weekday = itemDate.getDay();
      const emotion = normalizeEmotion(item.top_emotion);
      if (emotion) {
        weeklyEmotions[weekday] = emotion;
      }
    });
  }

  const weeklySummary = isFetching
    ? "주간 마음일기 통계를 불러오는 중입니다."
    : weeklyData?.message || undefined;

  const yAxisEmotions: Emotion[] = [
    "happy",
    "neutral",
    "surprise",
    "sad",
    "fear",
    "angry",
  ];
  // 고정 높이 기반 레이아웃: h-64(=256), 하단 날짜 영역(외부 pb-8 32 + 내부 paddingBottom 32)
  const CONTAINER_HEIGHT = 256;
  const OUTER_BOTTOM_PADDING = 32; // 부모 pb-8
  const INNER_BOTTOM_PADDING = 32; // 내부 컨테이너 paddingBottom
  const TOTAL_BOTTOM_PADDING = OUTER_BOTTOM_PADDING + INNER_BOTTOM_PADDING; // 64
  const ICON_SIZE = 24;

  return (
    <View className="bg-white rounded-[20px] p-6 gap-y-4 mb-4">
      <View className="flex-row items-center justify-between mb-2">
        {isReport && (
          <TouchableOpacity
            onPress={handlePrevWeek}
            className="w-10 h-10 rounded-full bg-gray10 items-center justify-center"
          >
            <Text className="text-gray90 text-xl">‹</Text>
          </TouchableOpacity>
        )}

        <View className="items-center flex-1">
          <Text className="text-gray90 text-[20px] font-bold">
            {month}월 {week}째주
          </Text>
          <Text className="text-gray70 text-[14px] mt-1">
            {formatDateRange(weekRange.start, weekRange.end)}
          </Text>
        </View>

        {isReport && (
          <TouchableOpacity
            onPress={handleNextWeek}
            className="w-10 h-10 rounded-full bg-gray10 items-center justify-center"
          >
            <Text className="text-gray90 text-xl">›</Text>
          </TouchableOpacity>
        )}
      </View>

      {isFetching ? (
        <View className="h-64 items-center justify-center">
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      ) : (
        <View className="h-64 relative pb-8">
          <View
            className="flex-1 ml-12 mr-4 flex-row items-stretch relative gap-x-3"
            style={{ paddingBottom: 32 }}
          >
            {(() => {
              const paddingBottomRatio =
                TOTAL_BOTTOM_PADDING / CONTAINER_HEIGHT;
              const availableHeight = 100 - paddingBottomRatio * 100;
              const topLabelPercentage =
                (0 / (yAxisEmotions.length - 1)) * availableHeight;
              const bottomLabelPercentage =
                ((yAxisEmotions.length - 1) / (yAxisEmotions.length - 1)) *
                availableHeight;

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
                    분노
                  </Text>
                </View>
              );
            })()}

            {yAxisEmotions.map((emotion, index) => {
              const paddingBottomRatio =
                TOTAL_BOTTOM_PADDING / CONTAINER_HEIGHT;
              const availableHeight = 100 - paddingBottomRatio * 100;
              const topPercentage =
                (index / (yAxisEmotions.length - 1)) * availableHeight;

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

            {weekdaysOrder.map((dayOfWeek) => {
              const dayName = weekDays[dayOfWeek];
              const today = new Date();
              today.setHours(0, 0, 0, 0);

              const weekStart = new Date(weekRange.start);
              const dayDate = new Date(weekStart);
              dayDate.setDate(
                weekStart.getDate() + dayOfWeek - weekStart.getDay()
              );

              const isToday = dayDate.getTime() === today.getTime();

              return (
                <View
                  key={`col-${dayOfWeek}`}
                  className="flex-1 items-center justify-center relative"
                  style={{ minHeight: 200 }}
                >
                  <View
                    className={`absolute flex-col items-center justify-center`}
                  >
                    <Text
                      className={`text-gray70 text-[12px] text-center ${isToday ? "text-main700 font-bold" : ""}`}
                    >
                      {dayName}
                    </Text>
                  </View>
                </View>
              );
            })}

            {/* 아이콘 오버레이: 가이드선과 동일 좌표계에서 렌더링 (하단 32px 내부 패딩 제외) */}
            <View
              className="absolute left-0 right-0"
              style={{ top: 0, bottom: INNER_BOTTOM_PADDING }}
            >
              <View className="flex-1 ml-4 mr-4 flex-row items-stretch relative gap-x-11">
                {weekdaysOrder.map((dayOfWeek) => {
                  const emotion = weeklyEmotions[dayOfWeek];
                  const emotionIndex = emotion
                    ? yAxisEmotions.indexOf(emotion)
                    : -1;
                  const ratio =
                    emotionIndex >= 0
                      ? emotionIndex / (yAxisEmotions.length - 1)
                      : 0.5;
                  // 가이드선과 동일한 좌표계(availableHeight%)를 사용
                  const paddingBottomRatio =
                    TOTAL_BOTTOM_PADDING / CONTAINER_HEIGHT;
                  const availableHeight = 100 - paddingBottomRatio * 100;
                  const topPercent = ratio * availableHeight;

                  return (
                    <View
                      key={`icon-${dayOfWeek}`}
                      className="flex-1 items-center justify-center relative"
                    >
                      {emotion && (
                        <View
                          className="absolute items-center justify-center"
                          style={{
                            top: `${topPercent}%` as any,
                            left: 0,
                            right: 0,
                            transform: [{ translateY: -ICON_SIZE / 2 }],
                            height: ICON_SIZE,
                          }}
                        >
                          <EmotionIconComponent
                            emotion={emotion as Emotion}
                            isBig={false}
                          />
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>

            <View className="absolute left-0 right-0 top-0 bottom-0 pointer-events-none" />
          </View>
        </View>
      )}

      {weeklySummary ? (
        <View className="bg-gray10 rounded-[16px] p-4 mt-2">
          <Text className="text-gray70 text-[14px] leading-5">
            {weeklySummary}
          </Text>
        </View>
      ) : null}
    </View>
  );
};
