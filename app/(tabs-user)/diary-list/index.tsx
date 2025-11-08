import { useAudioPlayer } from "@/shared/lib/hooks/useAudioPlayer";
import {
  AudioControlButton,
  Button,
  Footer,
  Icon,
  MainHeader,
  MainLayout,
} from "@/shared/ui";

import { queries } from "@/entities";
import { VoiceListItem } from "@/entities/voices/api/schema";
import { EmotionComponentWithText } from "@/shared/lib/emotions/components";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type DiaryListCardProps = {
  diary: VoiceListItem;
  isPlaying: boolean;
  isBuffering?: boolean;
  onPress: () => void;
};

const formatDateSimple = (date: Date) => {
  return `${date.getFullYear()}년 ${(date.getMonth() + 1).toString().padStart(2, "0")}월 ${date.getDate().toString().padStart(2, "0")}일`;
};

const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}년 ${month}월 ${day}일`;
};

const DiaryListCard = ({
  diary,
  isPlaying,
  isBuffering = false,
  onPress,
}: DiaryListCardProps) => {
  return (
    <TouchableOpacity
      className={`rounded-[20px] p-4 gap-y-2 bg-gray1 mx-4`}
      onPress={() => router.push(`/(tabs-user)/diary-list/${diary.voice_id}`)}
    >
      <View className="bg-gray10 rounded-full px-4 py-1 w-fit self-start">
        <Text className="text-gray90 text-[15px] font-semibold">
          {formatDate(diary.created_at)}
        </Text>
      </View>
      <View className="self-start">
        <EmotionComponentWithText
          emotion={diary.emotion ?? "unknown"}
          isBig={false}
        />
      </View>
      <Text className="text-main900 text-[15px] font-semibold mb-1 px-1">
        {diary?.question_title ??
          "오늘 주변에서 본 것 중 가장 보기 좋았던 풍경은 무엇인가요?"}
      </Text>
      <Text
        className="text-gray70 text-[13px] px-1"
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {diary?.content ??
          "창밖을 보니 길가에 심어놓은 국화꽃이 활짝 피었더라. 노랗고 하얀 꽃들이 옹기종기 모여 있는 모습이 참 예뻤다. 가을이 깊어가는구나 싶어 마음이 차분해졌다."}
      </Text>

      <AudioControlButton
        isPlaying={isPlaying}
        isBuffering={isBuffering}
        onPress={onPress}
      />
    </TouchableOpacity>
  );
};

export default function DiaryListScreen() {
  const { data: userInfo } = useQuery(queries.user.userInfo);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);


  const {
    data: diaries,
    refetch,
    isLoading,
  } = useQuery({
    ...queries.voices.userVoiceList(
      userInfo?.username ?? "",
      selectedDate ?? undefined
    ),
    enabled: !!userInfo?.username,
  });

  const { playAudio, isPlaying, isBuffering } = useAudioPlayer();

  const handleCardPress = async (diaryId: string) => {
    const diary = diaries?.voices?.find(
      (d: VoiceListItem) => d.voice_id === Number(diaryId)
    );
    if (diary) {
      const audioUri = diary.s3_url;
      if (audioUri) {
        await playAudio(diaryId, audioUri);
      }
    }
  };

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
      if (event.type === "dismissed") {
        return;
      }
    }
    if (Platform.OS === "ios") {
      if (event.type === "dismissed") {
        setShowDatePicker(false);
        return;
      }
    }
    if (date) {
      const normalized = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );

      setSelectedDate(normalized);
      if (Platform.OS === "ios") {
        setShowDatePicker(false);
      }
    }
  };
  const handleCalendarPress = () => {
    setShowDatePicker(true);
  };

  const renderDiaryCard = ({ item }: { item: VoiceListItem }) => {
    const isCurrentlyPlaying = isPlaying(item.voice_id.toString());
    const isCurrentlyBuffering = isBuffering(item.voice_id.toString());

    return (
      <DiaryListCard
        diary={item}
        isPlaying={isCurrentlyPlaying}
        isBuffering={isCurrentlyBuffering}
        onPress={() => handleCardPress(item.voice_id.toString())}
      />
    );
  };

  return (
    <MainLayout>
      <MainLayout.Header>
        <MainHeader
          title={selectedDate ? formatDateSimple(selectedDate) : "일기 목록"}
          rightComponent={
            <Button
              size="md"
              variant="text"
              layoutClassName="w-fit"
              innerClassName="flex-row items-center gap-x-2"
              onPress={handleCalendarPress}
            >
              <Text className="text-gray100 text-[15px] font-semibold">
                날짜 선택
              </Text>
              <Icon name="CalendarIcon" size={24} />
            </Button>
          }
        />
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate ?? new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "default" : "default"}
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}
      </MainLayout.Header>

      <MainLayout.Content className="bg-gray5 flex-1 p-0" footer={false}>
        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#6366f1" />
            <Text className="text-gray70 mt-4">일기를 불러오는 중...</Text>
          </View>
        ) : (
          <FlatList
            data={diaries?.voices ?? []}
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={() => {
                  refetch();
                }}
              />
            }
            renderItem={renderDiaryCard}
            ItemSeparatorComponent={() => <View className="h-5" />}
            keyExtractor={(item) => item.voice_id.toString()}
            ListHeaderComponent={() => (
              <View className="w-full h-[172px] bg-main50 flex items-center justify-center rounded-b-[20px]">
                <Text className="text-gray90 text-[15px]">
                  나를 더 알아가는 시간
                </Text>
                <Text className="text-xl font-bold">
                  <Text className="text-main700">내 마음</Text>은 어땠을까요?
                </Text>
                <Button
                  size="md"
                  variant="filled"
                  className="mx-20 mt-4"
                  hasArrow
                  onPress={() => router.push("/diary-list/analysis")}
                >
                  <Text className="text-white font-bold text-[17px]">
                    분석 결과 보기
                  </Text>
                </Button>
              </View>
            )}
            contentContainerStyle={{ flexGrow: 1 }}
            contentContainerClassName="gap-y-2"
            showsVerticalScrollIndicator={false}
            scrollEnabled
            ListEmptyComponent={
              <View className="flex-1 justify-center items-center">
                <Text className="text-gray70 text-center text-lg">
                  아직 저장된 일기가 없습니다
                </Text>
              </View>
            }
            ListFooterComponent={() => <Footer />}
          />
        )}
      </MainLayout.Content>
    </MainLayout>
  );
}
