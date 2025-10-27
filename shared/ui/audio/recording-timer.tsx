import { Text, View } from 'react-native';

interface RecordingTimerProps {
    duration: number;
    isRecording: boolean;
    isPaused: boolean;
    className?: string;
}

export function RecordingTimer({
    duration,
    isRecording,
    isPaused,
    className = ""
}: RecordingTimerProps) {
    // MM:SS 형식으로 시간 포맷팅
    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // 녹음 중이거나 일시정지 상태일 때만 표시
    if (!isRecording && !isPaused) {
        return null;
    }

    return (
        <View className={`flex-row items-center justify-center ${className}`}>
            <Text className="text-black text-lg font-bold">
                {formatTime(duration)}
            </Text>
        </View>
    );
}
