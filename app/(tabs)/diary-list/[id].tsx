import { useAudioPlayer } from "@/shared/lib/hooks/useAudioPlayer";
import { Diary, } from "@/shared/type";
import { AudioControlButton, AudioProgress, BackHeader, Button, EmotionComponent, HelpButton, Icon, MainLayout } from "@/shared/ui";
import { formatDate } from "@/shared/util/format";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Modal, Text, TouchableOpacity, View } from "react-native";

export default function DiaryDetailScreen() {

    const { id } = useLocalSearchParams();

    const { data: diary } = useQuery({
        queryKey: ['diary', id],
        queryFn: async () => await AsyncStorage.getItem('diaries'),
        select: (data: string | null) => data ? JSON.parse(data) : [],
        enabled: !!id
    });

    // if (!diary) {
    //     Alert.alert('일기를 찾을 수 없습니다.');
    //     return <Redirect href="/diary-list" />;
    // }

    const currentDiary = diary?.find((diary: Diary) => diary.id === id);
    const { playAudio, isPlaying, isBuffering, player, status } = useAudioPlayer({});

    const [isModalVisible, setIsModalVisible] = useState(false);

    const handlePlayPress = async () => {
        if (currentDiary) {
            const audioUri = currentDiary.serverUrl || currentDiary.fileUri;
            if (audioUri) {
                await playAudio(currentDiary.id, audioUri);
            }
        }
    };

    const handleDeletePress = async () => {
        const diaries = JSON.parse(await AsyncStorage.getItem('diaries') || '[]');
        const newDiaries = diaries?.filter((diary: Diary) => diary.id !== currentDiary?.id);
        await AsyncStorage.setItem('diaries', JSON.stringify(newDiaries));
    }

    const queryClient = useQueryClient();

    const { mutate: deleteDiary } = useMutation({
        mutationFn: handleDeletePress,
        onError: (error) => {
            Alert.alert('오류', '일기 삭제 중 오류가 발생했습니다.');
        },
        onSettled: () => {
            setIsModalVisible(false);
            router.replace('/diary-list');
            queryClient.invalidateQueries({ queryKey: ['diaryList'] });
        }
    });

    return (
        <MainLayout>
            <MainLayout.Header>
                <BackHeader title="일기 상세보기" rightComponent={<HelpButton />} />
            </MainLayout.Header>

            <MainLayout.Content className="bg-gray5 flex-1 p-4">
                <View className="bg-white rounded-[20px] p-6 gap-y-4">
                    <Text>{currentDiary?.id}</Text>
                    <Text className="text-gray90 text-[15px] font-semibold w-full text-center">
                        {formatDate(new Date().toISOString())}
                    </Text>
                    <EmotionComponent
                        className="self-center"
                        emotion={currentDiary?.emotion ?? 'calm'} isBig={false} showAiAnalysisText={true} />
                    <Text className="text-main900 text-[19px] font-bold">
                        {currentDiary?.title ?? '오늘 주변에서 본 것 중 가장 보기 좋았던 풍경은 무엇인가요?'}
                    </Text>

                    <Text className="text-black text-[17px] leading-6">
                        {currentDiary?.content ?? '창밖을 보니 길가에 심어놓은 국화꽃이 활짝 피었더라. 노랗고 하얀 꽃들이 옹기종기 모여 있는 모습이 참 예뻤다. 가을이 깊어가는구나 싶어 마음이 차분해졌다.'}
                    </Text>
                    {/* audio control component : 사진 참고 */}
                    <AudioProgress
                        player={player}
                        status={status}
                    />
                    <AudioControlButton
                        isPlaying={isPlaying(currentDiary?.id || '')}
                        isBuffering={isBuffering(currentDiary?.id || '')}
                        onPress={handlePlayPress}
                    />
                    <View className="self-end">
                        <Button variant="text" color="primary" onPress={() => setIsModalVisible(true)}>
                            <View className="flex-row items-center justify-center gap-x-1">
                                <Text className="text-gray70 text-[15px] font-semibold">일기 삭제하기</Text>
                                <Icon name="Trash" />
                            </View>
                        </Button>
                    </View>
                </View>
            </MainLayout.Content>
            <Modal
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
                transparent={true}
                animationType="fade"
            >
                <View className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View className="bg-white rounded-[20px] p-6 mx-4 w-full max-w-sm items-center justify-center">
                        <View className="relative mb-3 w-full flex-row justify-center items-start">
                            <Icon name="AlertRed" size={32} />
                            <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={() => setIsModalVisible(false)}
                                className="absolute right-0 top-0"
                            >
                                <Icon name="Close" size={20} />
                            </TouchableOpacity>
                        </View>
                        <Text className="text-gray90 text-[19px] text-center mb-6">일기를 정말 삭제하시겠습니까?</Text>
                        <View className="flex items-center justify-center gap-x-1 rounded-md bg-gray5 p-4">
                            <Text className="text-gray70 text-[15px] text-center">삭제된 일기 기록은 <Text className="text-[15px] font-semibold">다시 복구할 수 없습니다.</Text> 이 일기를 삭제하시겠습니까?</Text>
                        </View>
                        <View className="flex-row gap-x-3 w-full mt-4">
                            <Button
                                variant="filled"
                                color="primary"
                                onPress={() => setIsModalVisible(false)}
                                layoutClassName="flex-1 m-0"
                                className="m-0 bg-gray80"
                            >
                                <Text className="text-white text-[15px] font-semibold">취소</Text>
                            </Button>
                            <Button
                                variant="filled"
                                color="primary"
                                layoutClassName="flex-1 m-0"
                                className="m-0 bg-red700"
                                onPress={() => deleteDiary()}
                            >
                                <Text className="text-white text-[15px] font-semibold">삭제</Text>
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal>
        </MainLayout >
    );
}
