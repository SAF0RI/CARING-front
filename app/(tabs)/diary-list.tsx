import { Button, Footer, HelpButton, Icon, MainHeader, MainLayout } from "@/shared/ui";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { useEffect, useState } from "react";

import { formatDate } from "@/shared/util/format";
import { cn } from "@/shared/util/style";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, FlatList, RefreshControl, Text, TouchableOpacity, View } from "react-native";

type DiaryEntry = {
    id: string;
    fileName: string;
    serverUrl?: string;
    fileUri?: string;
    duration: number;
    createdAt: string;
    title: string;
    serverId?: string;
    emotion: 'anxiety' | 'calm' | 'happy' | 'sad';
};

type DiaryListCardProps = {
    diary: DiaryEntry;
    isPlaying: boolean;
    isBuffering?: boolean;
    onPress: () => void;
}

export const EmotionIconComponent = ({ emotion, isBig }: { emotion: DiaryEntry['emotion'], isBig: boolean }) => {
    switch (emotion) {
        case 'anxiety':
            return <Icon name={isBig ? "anxietyBig" : "anxiety"} size={isBig ? 40 : 20} />;
        case 'calm':
            return <Icon name={isBig ? "calmBig" : "calm"} size={isBig ? 40 : 20} />;
        case 'happy':
            return <Icon name={isBig ? "happyBig" : "happy"} size={isBig ? 40 : 20} />;
        case 'sad':
            return <Icon name={isBig ? "sadBig" : "sad"} size={isBig ? 40 : 20} />;
        default:
            return null;
    }
};


export const EmotionComponent = ({
    emotion = 'calm',
    isBig = false,
}: {
    emotion?: DiaryEntry['emotion'],
    isBig?: boolean;
}) => {
    const bgColorMap = {
        anxiety: 'bg-anxietyBg',
        calm: 'bg-calmBg',
        happy: 'bg-happyBg',
        sad: 'bg-sadBg',
    }
    const textColorMap = {
        anxiety: 'text-anxietyText',
        calm: 'text-calmText',
        happy: 'text-happyText',
        sad: 'text-sadText',
    }
    const bgColor = bgColorMap[emotion];
    const textColor = textColorMap[emotion];

    const emotionText: Record<DiaryEntry['emotion'], string> = {
        anxiety: '불안',
        calm: '평온',
        happy: '즐거움',
        sad: '슬픔',
    }

    return (
        <View className={cn([`rounded-full`, bgColor, 'flex-row items-center justify-center px-3 py-1 gap-x-1'])}>
            <EmotionIconComponent emotion={emotion} isBig={isBig} />
            <Text className={cn([textColor, 'text-[15px] font-semibold'])}>{emotionText[emotion]}</Text>
        </View>
    );
};


const DiaryListCard = ({ diary, isPlaying, isBuffering = false, onPress }: DiaryListCardProps) => {
    const getStatusText = () => {
        if (isBuffering) return "로딩중";
        if (isPlaying) return "재생중";
        return "재생하기";
    };

    return (
        <TouchableOpacity
            className={`rounded-[20px] p-4 gap-y-2 bg-gray1 mx-4`}
        >
            <View className="bg-gray10 rounded-full px-4 py-1 w-fit self-start">
                <Text className="text-gray90 text-[15px] font-semibold">{formatDate(diary.createdAt)}</Text>
            </View>
            <View className="self-start">
                <EmotionComponent emotion={diary.emotion} isBig={false} />
            </View>
            <Text className="text-gray90 text-[15px] font-semibold mb-1 px-1">{'오늘 주변에서 본 것 중 가장 보기 좋았던 풍경은 무엇인가요?'}</Text>
            <Text
                className="text-gray70 text-[13px] px-1"
                numberOfLines={2}
                ellipsizeMode="tail"
            >
                {diary.content ?? '창밖을 보니 길가에 심어놓은 국화꽃이 활짝 피었더라. 노랗고 하얀 꽃들이 옹기종기 모여 있는 모습이 참 예뻤다. 가을이 깊어가는구나 싶어 마음이 차분해졌다.'}
            </Text>

            <Button
                size="md"
                variant="filled"
                layoutClassName="w-[150px] mt-2"
                className="m-0"
                onPress={onPress}
            >
                <View className="flex-row items-center justify-center gap-x-1">
                    {
                        isBuffering ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <>
                                <Text className="text-white text-[13px] font-bold">
                                    {getStatusText()}
                                </Text>
                                <Icon
                                    name={isPlaying ? "Pause" : "Play"}
                                    size={20}
                                    color="white"
                                />
                            </>
                        )
                    }

                </View>
            </Button >
        </TouchableOpacity >
    );
};

export default function DiaryListScreen() {
    const [playingId, setPlayingId] = useState<string | null>(null);

    const { data: diaries, refetch, isLoading } = useQuery({
        queryKey: ['diaryList'],
        queryFn: async () => await AsyncStorage.getItem('diaries'),
        select: (data: string | null) => data ? JSON.parse(data) : []
    });

    const currentDiary = diaries?.find((diary: DiaryEntry) => diary.id === playingId);
    const audioUri = currentDiary ? (currentDiary.serverUrl || currentDiary.fileUri) : '';
    const player = useAudioPlayer(audioUri || '');
    const status = useAudioPlayerStatus(player);

    // 오디오 자동 재생
    useEffect(() => {
        if (playingId && audioUri && status.isLoaded) {
            const playAudio = async () => {
                try {
                    await player.play();
                } catch (error) {
                    console.error('오디오 재생 실패:', error);
                }
            };
            playAudio();
        }
    }, [playingId, audioUri, status.isLoaded, player]);

    // 오디오 종료 감지
    useEffect(() => {
        if (status.didJustFinish && playingId) {
            setPlayingId(null);
        }
    }, [status.didJustFinish, playingId]);

    // 상태 정보 (필요시 사용)
    // const isBuffering = status.isBuffering;
    // const isLoaded = status.isLoaded;
    // const currentTime = status.currentTime;
    // const duration = status.duration;


    const handleCardPress = async (diaryId: string) => {
        if (playingId === diaryId) {
            // 같은 카드 클릭 - 토글
            if (status.playing) {
                await player.pause();
            } else {
                await player.play();
            }
        } else {
            // 다른 카드 클릭 - 이전 재생 중지 후 새 재생
            if (status.playing) {
                await player.pause();
            }
            setPlayingId(diaryId);
        }
    };


    const renderDiaryCard = ({ item }: { item: DiaryEntry }) => {
        const isCurrentlyPlaying = playingId === item.id && status.playing;
        const isCurrentlyBuffering = playingId === item.id && status.isBuffering;

        return (
            <DiaryListCard
                diary={item}
                isPlaying={isCurrentlyPlaying}
                isBuffering={isCurrentlyBuffering}
                onPress={() => handleCardPress(item.id)}
            />
        );
    };

    return (
        <MainLayout>
            <MainLayout.Header>
                <MainHeader
                    title="일기 리스트"
                    rightComponent={<HelpButton />}
                />
            </MainLayout.Header>

            <MainLayout.Content className="bg-gray5 flex-1 p-0">
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
                            >
                                <Text className="text-white font-bold text-[17px]">분석 결과 보기</Text>
                            </Button>
                        </View>}
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