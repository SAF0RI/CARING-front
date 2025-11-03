import { Button, Icon, MainHeader, MainLayout } from "@/shared/ui";

import { queries } from "@/entities";
import { CareVoiceListItem, TopEmotionResponse } from "@/entities/care/api/schema";
import { emotionKorMap } from "@/shared/lib/emotions";
import { EmotionIconComponent } from "@/shared/lib/emotions/components";
import { formatDate } from "@/shared/util/format";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList, Platform, RefreshControl, Text, TouchableOpacity, View } from "react-native";

type DiaryListCardProps = {
    diary: CareVoiceListItem;
    topEmotion: TopEmotionResponse;
    onPress: () => void;
}

const DiaryListCard = ({ diary, topEmotion }: DiaryListCardProps) => {

    return (
        <TouchableOpacity
            className={`rounded-[20px] px-4 gap-y-2 bg-gray1 mx-4 py-4`}
            onPress={() => router.push(`/diary-list/${diary.voice_id}`)}
        >
            <View className="bg-gray10 rounded-full px-4 py-1 w-fit self-start">
                <Text className="text-gray90 text-[15px] font-semibold">{formatDate(diary.created_at)}</Text>
            </View>
            <View className="flex flex-row items-center justify-start">
                <EmotionIconComponent emotion={diary.emotion ?? 'unknown'} isBig={true} />
                <View className="flex-1 ml-2">
                    <Text className="text-gray90 text-[15px] ">{`${topEmotion?.user_name ?? ''} 님은`}</Text>
                    <Text className="text-gray90 text-[15px] font-semibold">{`${emotionKorMap[diary.emotion ?? 'unknown']} 상태에요!`}</Text>
                </View>
                <Icon name="ChevronRightBlack" size={24} />
            </View>


        </TouchableOpacity >
    );
};

export default function DiaryListScreen() {

    const { data: userInfo } = useQuery(queries.user.userInfo);

    const { data: topEmotion } = useQuery({
        ...queries.care.topEmotion(userInfo?.username ?? ''),
        enabled: !!userInfo?.username,
    });

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const { data: diaries, refetch, isFetching } = useQuery({
        ...queries.care.careUserVoiceList(userInfo?.username ?? '', selectedDate ?? undefined),
        enabled: !!userInfo?.username,
    });

    const handleDateChange = (event: any, date?: Date) => {
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
            if (event.type === 'dismissed') {
                return;
            }
        }
        if (Platform.OS === 'ios') {
            if (event.type === 'dismissed') {
                setShowDatePicker(false);
                return;
            }
        }
        if (date) {
            setSelectedDate(date);
            if (Platform.OS === 'ios') {
                setShowDatePicker(false);
            }
        }
    };

    const handleCalendarPress = () => {
        setShowDatePicker(true);
    };

    const renderDiaryCard = ({ item, topEmotion }: { item: CareVoiceListItem, topEmotion: TopEmotionResponse }) => {
        return (
            <DiaryListCard
                diary={item}
                topEmotion={topEmotion}
                onPress={() => router.push(`/diary-list/${item.voice_id}`)}
            />
        );
    };


    return (
        <MainLayout>
            <MainLayout.Header>
                <MainHeader
                    title="일기 리스트"
                    rightComponent={
                        <Button
                            size="md"
                            variant="text"
                            className="self-end"
                            layoutClassName="w-fit"
                            onPress={handleCalendarPress}
                        >
                            <Icon name="CalendarIcon" size={24} />
                        </Button>
                    }
                />
                {showDatePicker && (
                    <DateTimePicker
                        value={selectedDate ?? new Date()}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'default' : 'default'}
                        onChange={handleDateChange}
                        maximumDate={new Date()}
                    />
                )}
            </MainLayout.Header>
            <MainLayout.Content className="bg-gray5 flex-1 p-0" footer={false}>
                {false ? (
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator size="large" color="#6366f1" />
                        <Text className="text-gray70 mt-4">일기를 불러오는 중...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={diaries?.voices ?? []}
                        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={() => { refetch() }} />}
                        renderItem={({ item }) => renderDiaryCard({ item, topEmotion: topEmotion ?? { date: '', user_name: '', top_emotion: 'unknown' } })}
                        ItemSeparatorComponent={() => <View className="h-5" />}
                        keyExtractor={(item, index) => `${item.voice_id}-${index}`}
                        contentContainerStyle={{ flexGrow: 1, marginTop: 20 }}
                        contentContainerClassName="gap-y-1"
                        showsVerticalScrollIndicator={false}
                        scrollEnabled
                        // 현재 선택 상태 표시 (null이면 전체)
                        ListHeaderComponent={() => <View className="pl-4 pb-2">
                            <Text className="text-gray90 text-[19px] font-semibold">{selectedDate ? formatDate(selectedDate.toISOString()) : '전체 일기'}</Text>
                        </View>}
                        ListEmptyComponent={
                            <View className="flex-1 justify-center items-center">
                                <Text className="text-gray70 text-center text-lg">
                                    아직 저장된 일기가 없습니다
                                </Text>
                            </View>
                        }
                    />
                )}
            </MainLayout.Content>
        </MainLayout>
    );
}
