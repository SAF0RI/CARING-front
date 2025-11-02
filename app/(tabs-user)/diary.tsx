import { queries } from '@/entities/index';
import { getLocalUserInfo } from "@/entities/user/api/storage";
import { UploadVoiceWithQuestionRequest, uploadVoiceWithQuestion } from "@/entities/voices/api";
import { Button, HelpButton, Icon, MainHeader, MainLayout, RecordingTimer, SpeechBubble } from "@/shared/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    RecordingPresets,
    RecordingStatus,
    requestRecordingPermissionsAsync,
    setAudioModeAsync,
    useAudioRecorder,
    useAudioRecorderState,
} from "expo-audio";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";

const bubbleText = {
    play: "이 버튼을 누르면\n제가 귀 기울여 들을게요!",
    recording: "듣고 있어요!\n눌러서 멈출 수 있어요",
    paused: "녹음 완료!\n저장하거나 이어서 녹음하거나 완료할 수 있어요",
};

export default function DiaryScreen() {

    const { data: randomQuestion, isFetching: isFetchingRandomQuestion, refetch: refetchRandomQuestion } = useQuery(queries.questions.randomQuestion);

    const questionId = randomQuestion?.question?.question_id;

    const [currentBubbleText, setCurrentBubbleText] = useState(bubbleText.play);

    const audioRecorder = useAudioRecorder(
        RecordingPresets.HIGH_QUALITY,
        (status: RecordingStatus) => {
            console.log({ status })
        }
    );

    const recordingState = useAudioRecorderState(audioRecorder, 100);

    useEffect(() => {
        (async () => {
            const { granted } = await requestRecordingPermissionsAsync();
            if (!granted) {
                console.warn("Microphone permission was denied");
                return;
            }
            await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
        })();
    }, []);

    const record = async () => {
        if (audioRecorder.uri) {
            await audioRecorder.stop();
        }
        await audioRecorder.prepareToRecordAsync();
        await audioRecorder.record();
        setCurrentBubbleText(bubbleText.recording);
    };

    const pause = async () => {
        audioRecorder.pause();
        setCurrentBubbleText(bubbleText.paused);
    };

    const stopRecording = async () => {
        await audioRecorder.stop();
        setCurrentBubbleText(bubbleText.play);
    };

    const handleMainButtonPress = async () => {

        if (isFetchingRandomQuestion) {
            Alert.alert("오류", "질문을 불러오는 중입니다, 질문이 보이면 눌러주세요.");
            return;
        }

        if (recordingState.isRecording) {
            await pause();
            return;
        }

        if (!recordingState.isRecording && recordingState.durationMillis > 0) {
            await audioRecorder.record();
            setCurrentBubbleText(bubbleText.recording);
            return;
        }

        await record();
    };

    const { mutateAsync: uploadVoiceWithQuestionMutation, isPending: isSaving } = useMutation({
        mutationFn: async (data: UploadVoiceWithQuestionRequest) => await uploadVoiceWithQuestion(data),
    });

    const queryClient = useQueryClient();

    const handleSaveServer = async () => {
        try {
            await stopRecording();

            if (!audioRecorder.uri) {
                Alert.alert("오류", "저장할 녹음 파일이 없습니다.");
                return;
            }

            const userInfo = await getLocalUserInfo();
            const username = userInfo?.username;
            if (!username) {
                Alert.alert("오류", "로그인이 필요합니다.");
                return;
            }

            const fileName = `diary_${Date.now()}.m4a`;

            if (!questionId) {
                Alert.alert("오류", "질문 ID가 없습니다.");
                return;
            }

            await uploadVoiceWithQuestionMutation(
                {
                    file: {
                        uri: audioRecorder.uri,
                        type: 'audio/m4a',
                        name: fileName,
                    },
                    question_id: questionId,
                    username,
                },
                {
                    onSuccess: (data: any) => {
                        if (data?.success) {
                            Alert.alert("저장 완료!", "마음일기가 성공적으로 서버에 저장되었습니다.", [
                                { text: "확인" },
                            ]);
                            setCurrentBubbleText(bubbleText.play);
                            // 목록 화면이 활성화되어 있으면 자동으로 새로고침, 아니면 다음 접근 시 새로고침
                            queryClient.invalidateQueries(queries.voices.userVoiceList(username));
                        } else {
                            Alert.alert("오류", data?.message || "서버 업로드 실패");
                        }
                    },
                    onError: (error: any) => {
                        console.error('서버 업로드 중 문제가 발생했습니다:', error);
                        Alert.alert("오류", "서버 업로드 중 문제가 발생했습니다.");
                    },
                }
            );
        } catch (error) {
            console.error('저장 중 오류 발생:', error);
            Alert.alert("오류", "서버 업로드 중 문제가 발생했습니다.");
        }
    };

    return (
        <MainLayout className="bg-gray-50">
            <MainLayout.Header>
                <MainHeader
                    title="마음일기"
                    rightComponent={<HelpButton />}
                />
            </MainLayout.Header>
            <ScrollView
                className="flex-1 w-full"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isFetchingRandomQuestion}
                        onRefresh={refetchRandomQuestion}
                    />
                }
            >
                {/* 상단 질문 컴포넌트 */}
                <View className="w-full h-[172px] bg-main50 flex items-center justify-center rounded-b-[20px] px-4">
                    <Text className="text-gray90 text-[15px]">어떤 이야기도 괜찮아요!</Text>
                    <Text className="text-xl font-bold text-center flex-wrap px-8">
                        {isFetchingRandomQuestion ? '질문을 불러오는 중입니다' : randomQuestion?.question?.content ?? ''}
                    </Text>
                </View>

                <View className="w-full mt-8 px-5">
                    {/* 녹음 파형 및 타이머 컴포넌트 */}
                    <View className="flex flex-row items-center justify-center h-[60px] bg-gray10 rounded-[20px] w-full">
                        {/* <WaveformVisualizer
                        audioLevel={audioLevel}
                        isRecording={isRecording}
                        isPaused={isPaused}
                        waveformData={waveformData}
                    /> */}
                        <RecordingTimer
                            duration={recordingState.durationMillis / 1000}
                            isRecording={recordingState.isRecording}
                            isPaused={!recordingState.isRecording}
                        />
                    </View>
                </View>

                <View className="flex-row items-center justify-center px-4 mt-10 relative w-full">
                    {/* 녹음 조정 버튼 - 항상 가운데 */}
                    <TouchableOpacity
                        className={`w-[88px] h-[88px] rounded-full flex items-center justify-center bg-main500 ${recordingState.isRecording ? 'bg-main700' : ''}`}
                        onPress={handleMainButtonPress}
                    >
                        <Icon
                            name={recordingState.isRecording ? "Stop" : "Mic"}
                            width={40}
                            height={40}
                        />
                    </TouchableOpacity>

                    {/* 저장하기 버튼 - 우측에 위치 */}
                    {
                        !recordingState.isRecording && recordingState.durationMillis > 0 && !isSaving && (
                            <View className="absolute right-8">
                                <Button size="lg" variant="filled" onPress={handleSaveServer}>
                                    {
                                        isSaving ? <ActivityIndicator size="small" color="white" /> :
                                            <Text className="text-white text-[15px] font-bold px-5">저장하기</Text>
                                    }
                                </Button>
                            </View>
                        )
                    }
                    {
                        isSaving && (
                            <View className="absolute right-8">
                                <Button className='flex-row items-center justify-center gap-x-2' size="lg" variant="filled" disabled>
                                    <ActivityIndicator size="small" color="white" />
                                    <Text className="text-white text-[15px] font-bold px-5">저장 중...</Text>
                                </Button>
                            </View>
                        )
                    }
                </View>
                <View className="flex items-center justify-center w-full h-fit">
                    <SpeechBubble className="h-fit w-2/3 px-5 flex items-center justify-center">
                        <Text className="text-gray-800 text-base text-center">
                            {currentBubbleText}
                        </Text>
                    </SpeechBubble>
                </View>
            </ScrollView>
        </MainLayout >
    );
}

