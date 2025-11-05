import { queries } from "@/entities";
import { deleteUserVoice } from "@/entities/voices/api/handler";
import { EmotionComponentWithText } from "@/shared/lib/emotions/components";
import { useAudioPlayer } from "@/shared/lib/hooks/useAudioPlayer";
import { AudioControlButton, AudioProgress, BackHeader, Button, HelpButton, Icon, MainLayout } from "@/shared/ui";
import { formatDate } from "@/shared/util/format";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Modal, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function DiaryDetailScreen() {

    const { id } = useLocalSearchParams();

    const { data: userInfo } = useQuery(queries.user.userInfo);

    const { data: diary, refetch, isFetching } = useQuery({
        ...queries.voices.userVoiceDetail(Number(id), userInfo?.username ?? ''),
        enabled: !!id && !!userInfo?.username,
    });


    const currentDiary = diary?.voice_id === Number(id) ? diary : null;
    const { playAudio, isPlaying, isBuffering, player, status } = useAudioPlayer({});

    const [isModalVisible, setIsModalVisible] = useState(false);

    const handlePlayPress = async () => {
        if (currentDiary) {
            const audioUri = currentDiary.s3_url;
            if (audioUri) {
                await playAudio(currentDiary.voice_id.toString(), audioUri);
            }
        }
    };

    const queryClient = useQueryClient();

    const { mutate: deleteDiary, isPending: isDeleting } = useMutation({
        mutationFn: () => deleteUserVoice(Number(id), userInfo?.username ?? ''),
        onError: () => {
            Alert.alert('오류', '일기 삭제 중 오류가 발생했습니다.');
        },
        onSettled: () => {
            setIsModalVisible(false);
            router.replace('/(tabs-user)/diary-list');
            queryClient.invalidateQueries(queries.voices.userVoiceList(userInfo?.username ?? ''));
        }
    });

    return (
        <MainLayout>
            <MainLayout.Header>
                <BackHeader title="일기 상세보기" rightComponent={<HelpButton />} />
            </MainLayout.Header>

            <MainLayout.Content className="bg-gray5 flex-1 p-4" footer={false}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={isFetching} onRefresh={() => { refetch(); }} />
                    }
                >
                    <View className="bg-white rounded-[20px] p-6 gap-y-4">
                        <Text className="text-gray90 text-[15px] font-semibold w-full text-center">
                            {currentDiary?.created_at ? formatDate(currentDiary.created_at) : '-'}
                        </Text>
                        <EmotionComponentWithText
                            className="self-center"
                            emotion={currentDiary?.top_emotion ?? 'unknown'} isBig={false} showAiAnalysisText={true} />
                        <Text className="text-main900 text-[19px] font-bold">
                            {currentDiary?.title ?? '오늘 주변에서 본 것 중 가장 보기 좋았던 풍경은 무엇인가요?'}
                        </Text>

                        <Text className="text-black text-[17px] leading-6">
                            {currentDiary?.voice_content ?? '아직 기록이 완성되지 않았습니다.'}
                        </Text>
                        {/* audio control component : 사진 참고 */}
                        <AudioProgress
                            player={player}
                            status={status}
                        />
                        <AudioControlButton
                            isPlaying={isPlaying(currentDiary?.voice_id.toString() || '')}
                            isBuffering={isBuffering(currentDiary?.voice_id.toString() || '')}
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
                </ScrollView>
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
                                disabled={isDeleting}
                            >
                                <Text className="text-white text-[15px] font-semibold">취소</Text>
                            </Button>
                            <Button
                                variant="filled"
                                color="primary"
                                layoutClassName="flex-1 m-0"
                                className="m-0 bg-red700"
                                onPress={() => deleteDiary()}
                                disabled={isDeleting}
                            >
                                <Text className="text-white text-[15px] font-semibold">{isDeleting ? <ActivityIndicator size="small" color="white" /> : '삭제'}</Text>
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal>
        </MainLayout >
    );
}
