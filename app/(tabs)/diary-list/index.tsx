import { useAudioPlayer } from "@/shared/lib/hooks/useAudioPlayer";
import { Diary } from "@/shared/type";
import { AudioControlButton, Button, EmotionComponent, Footer, HelpButton, MainHeader, MainLayout } from "@/shared/ui";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { formatDate } from "@/shared/util/format";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { ActivityIndicator, FlatList, RefreshControl, Text, TouchableOpacity, View } from "react-native";

type DiaryListCardProps = {
    diary: Diary;
    isPlaying: boolean;
    isBuffering?: boolean;
    onPress: () => void;
}

const DiaryListCard = ({ diary, isPlaying, isBuffering = false, onPress }: DiaryListCardProps) => {

    return (
        <TouchableOpacity
            className={`rounded-[20px] p-4 gap-y-2 bg-gray1 mx-4`}
            onPress={() => router.push(`/diary-list/${diary.id}`)}
        >
            <View className="bg-gray10 rounded-full px-4 py-1 w-fit self-start">
                <Text className="text-gray90 text-[15px] font-semibold">{formatDate(diary.createdAt)}</Text>
            </View>
            <View className="self-start">
                <EmotionComponent emotion={diary.emotion} isBig={false} />
            </View>
            <Text className="text-main900 text-[15px] font-semibold mb-1 px-1">{diary?.title ?? '오늘 주변에서 본 것 중 가장 보기 좋았던 풍경은 무엇인가요?'}</Text>
            <Text
                className="text-gray70 text-[13px] px-1"
                numberOfLines={2}
                ellipsizeMode="tail"
            >
                {diary?.content ?? '창밖을 보니 길가에 심어놓은 국화꽃이 활짝 피었더라. 노랗고 하얀 꽃들이 옹기종기 모여 있는 모습이 참 예뻤다. 가을이 깊어가는구나 싶어 마음이 차분해졌다.'}
            </Text>

            <AudioControlButton
                isPlaying={isPlaying}
                isBuffering={isBuffering}
                onPress={onPress}
            />
        </TouchableOpacity >
    );
};

export default function DiaryListScreen() {
    const { data: diaries, refetch, isLoading } = useQuery({
        queryKey: ['diaryList'],
        queryFn: async () => await AsyncStorage.getItem('diaries'),
        select: (data: string | null) => data ? JSON.parse(data) : []
    });

    const { playAudio, isPlaying, isBuffering } = useAudioPlayer();

    const handleCardPress = async (diaryId: string) => {
        const diary = diaries?.find((d: Diary) => d.id === diaryId);
        if (diary) {
            const audioUri = diary.serverUrl || diary.fileUri;
            if (audioUri) {
                await playAudio(diaryId, audioUri);
            }
        }
    };


    const renderDiaryCard = ({ item }: { item: Diary }) => {
        const isCurrentlyPlaying = isPlaying(item.id);
        const isCurrentlyBuffering = isBuffering(item.id);

        return (
            <DiaryListCard
                diary={item}
                isPlaying={isCurrentlyPlaying}
                isBuffering={isCurrentlyBuffering}
                onPress={() => handleCardPress(item.id)}
            />
        );
    };

    console.log(diaries);

    return (
        <MainLayout>
            <MainLayout.Header>
                <MainHeader
                    title="일기 리스트"
                    rightComponent={<HelpButton />}
                />
            </MainLayout.Header>

            <MainLayout.Content className="bg-gray5 flex-1 p-0" footer={false}>
                {isLoading ? (
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator size="large" color="#6366f1" />
                        <Text className="text-gray70 mt-4">일기를 불러오는 중...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={diaries}
                        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => { refetch() }} />}
                        renderItem={renderDiaryCard}
                        ItemSeparatorComponent={() => <View className="h-5" />}
                        keyExtractor={(item) => item.id}
                        ListHeaderComponent={() => <View className="w-full h-[172px] bg-main50 flex items-center justify-center rounded-b-[20px]">
                            <Text className="text-gray90 text-[15px]">나를 더 알아가는 시간</Text>
                            <Text className="text-xl font-bold">
                                <Text className="text-main700">내 마음</Text>은 어땠을까요?
                            </Text>
                            <Button
                                size="md"
                                variant="filled"
                                className="mx-20 mt-4"
                                hasArrow
                                onPress={() => router.push('/diary-list/analysis')}
                            >
                                <Text className="text-white font-bold text-[17px]">분석 결과 보기</Text>
                            </Button>
                        </View>}
                        contentContainerStyle={{ flexGrow: 1 }}
                        contentContainerClassName="gap-y-4"
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
