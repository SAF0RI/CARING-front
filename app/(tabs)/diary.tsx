import { Button, HelpButton, Icon, MainHeader, MainLayout, RecordingTimer, SpeechBubble } from "@/shared/ui";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    RecordingPresets,
    RecordingStatus,
    requestRecordingPermissionsAsync,
    setAudioModeAsync,
    useAudioRecorder,
    useAudioRecorderState,
} from "expo-audio";
import { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

const bubbleText = {
    play: "이 버튼을 누르면\n제가 귀 기울여 들을게요!",
    recording: "듣고 있어요!\n눌러서 멈출 수 있어요",
    paused: "녹음 완료!\n저장하거나 이어서 녹음하거나 완료할 수 있어요",
};

export default function DiaryScreen() {
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

    const handleSaveServer = async () => {
        try {
            await stopRecording();

            if (audioRecorder.uri) {
                // 1. 파일을 FormData로 준비
                const fileName = `diary_${Date.now()}.m4a`;
                const formData = new FormData();

                // 파일을 FormData에 추가
                formData.append('audio', {
                    uri: audioRecorder.uri,
                    type: 'audio/m4a',
                    name: fileName,
                } as any);

                // 2. 메타데이터 추가
                formData.append('metadata', JSON.stringify({
                    duration: recordingState.durationMillis,
                    createdAt: new Date().toISOString(),
                    title: "오늘의 마음일기"
                }));

                // 3. 서버에 업로드
                const response = await fetch('https://your-api-endpoint.com/api/diary/upload', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (response.ok) {
                    const result = await response.json();

                    const diaryEntry = {
                        id: result.id || Date.now().toString(),
                        fileName: fileName,
                        serverUrl: result.fileUrl,
                        duration: recordingState.durationMillis,
                        createdAt: new Date().toISOString(),
                        title: "오늘의 마음일기",
                        serverId: result.id
                    };

                    const existingDiaries = await AsyncStorage.getItem('diaries');
                    const diaries = existingDiaries ? JSON.parse(existingDiaries) : [];

                    diaries.push(diaryEntry);

                    await AsyncStorage.setItem('diaries', JSON.stringify(diaries));

                    Alert.alert(
                        "저장 완료!",
                        "마음일기가 성공적으로 서버에 저장되었습니다.",
                        [{ text: "확인" }]
                    );

                    setCurrentBubbleText(bubbleText.play);
                } else {
                    throw new Error('서버 업로드 실패');
                }

            } else {
                Alert.alert("오류", "저장할 녹음 파일이 없습니다.");
            }
        } catch (error) {
            console.error('저장 중 오류 발생:', error);
            Alert.alert("오류", "서버 업로드 중 문제가 발생했습니다.");
        }
    };

    const handleSaveLocal = async () => {
        try {
            await stopRecording();

            if (audioRecorder.uri) {
                // 로컬에 메타데이터만 저장 (파일은 audioRecorder.uri에 이미 존재)
                const diaryEntry = {
                    id: Date.now().toString(),
                    fileName: `diary_${Date.now()}.m4a`,
                    fileUri: audioRecorder.uri, // 로컬 파일 URI 사용
                    duration: recordingState.durationMillis,
                    createdAt: new Date().toISOString(),
                    title: "오늘의 마음일기"
                };

                // 기존 일기 목록 가져오기
                const existingDiaries = await AsyncStorage.getItem('diaries');
                const diaries = existingDiaries ? JSON.parse(existingDiaries) : [];

                // 새 일기 추가
                diaries.push(diaryEntry);

                // 저장
                await AsyncStorage.setItem('diaries', JSON.stringify(diaries));

                Alert.alert(
                    "저장 완료!",
                    "마음일기가 성공적으로 저장되었습니다.",
                    [{ text: "확인" }]
                );

                // 녹음 상태 초기화
                setCurrentBubbleText(bubbleText.play);

            } else {
                Alert.alert("오류", "저장할 녹음 파일이 없습니다.");
            }
        } catch (error) {
            console.error('저장 중 오류 발생:', error);
            Alert.alert("오류", "저장 중 문제가 발생했습니다.");
        }
    };

    const handleSave = handleSaveLocal; // 현재는 로컬 저장 사용


    return (
        <MainLayout className="bg-gray-50">
            <MainLayout.Header>
                <MainHeader
                    title="마음일기"
                    rightComponent={<HelpButton />}
                />
            </MainLayout.Header>
            {/* 상단 질문 컴포넌트 */}
            <View className="w-full h-[172px] bg-main50 flex items-center justify-center rounded-b-[20px]">
                <Text className="text-gray90 text-[15px]">어떤 이야기도 괜찮아요!</Text>
                <Text className="text-xl font-bold">
                    오늘 <Text className="text-main700">가장 즐거웠던 일</Text>은
                </Text>
                <Text className="text-xl font-bold">무엇인가요?</Text>
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
                    !recordingState.isRecording && recordingState.durationMillis > 0 && (
                        <View className="absolute right-8">
                            <Button size="lg" variant="filled" onPress={handleSave}>
                                <Text className="text-white text-[15px] font-bold px-5">저장하기</Text>
                            </Button>
                        </View>
                    )
                }
            </View>
            <SpeechBubble className="h-fit w-fit px-5 flex items-center justify-center">
                <Text className="text-gray-800 text-base text-center">
                    {currentBubbleText}
                </Text>
            </SpeechBubble>
        </MainLayout >
    );
}
