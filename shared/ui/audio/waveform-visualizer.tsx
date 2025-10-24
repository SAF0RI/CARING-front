import { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';

interface WaveformVisualizerProps {
    audioLevel: number;
    isRecording: boolean;
    isPaused?: boolean;
    waveformData?: number[];
    className?: string;
}

export function WaveformVisualizer({
    audioLevel,
    isRecording,
    isPaused = false,
    waveformData = [],
    className = ""
}: WaveformVisualizerProps) {
    const scrollX = useRef(new Animated.Value(0)).current;
    const containerWidth = 300; // 고정 컨테이너 너비
    const barWidth = 3;
    const barSpacing = 1;
    const totalBarWidth = barWidth + barSpacing;
    const maxVisibleBars = Math.floor(containerWidth / totalBarWidth); // 화면에 보이는 막대 수

    // 외부에서 전달받은 waveformData를 사용하므로 내부 상태 관리 제거

    // 스크롤 애니메이션 (파형이 넘치면 우측으로 이동)
    useEffect(() => {
        if ((isRecording || isPaused) && waveformData.length > maxVisibleBars) {
            const scrollAmount = (waveformData.length - maxVisibleBars) * totalBarWidth;
            // 현재 스크롤 위치를 유지하면서 부드럽게 이동
            Animated.timing(scrollX, {
                toValue: -scrollAmount, // 음수로 왼쪽으로 이동
                duration: 50, // 매우 빠른 반응
                easing: Easing.linear, // 선형 애니메이션으로 밀리는 느낌 제거
                useNativeDriver: true,
            }).start();
        } else if (!isRecording && !isPaused) {
            Animated.timing(scrollX, {
                toValue: 0,
                duration: 300, // 초기화도 부드럽게
                easing: Easing.out(Easing.cubic), // 부드러운 cubic easing 적용
                useNativeDriver: true,
            }).start();
        }
    }, [waveformData.length, isRecording, isPaused, scrollX, maxVisibleBars, totalBarWidth]);

    return (
        <View
            className={`h-[100px] bg-gray-100 rounded-lg overflow-hidden ${className}`}
            style={{ width: containerWidth }}
        >
            <Animated.View
                className="flex-row items-center h-full"
                style={{
                    transform: [{ translateX: scrollX }],
                    paddingHorizontal: 4,
                }}
            >
                {waveformData.map((height, index) => {
                    const barHeight = Math.max(4, height * 30); // 최소 4px, 최대 30px (위아래로 나누어서)
                    return (
                        <View
                            key={index}
                            className="flex-col justify-center"
                            style={{
                                width: barWidth,
                                height: 60, // 전체 높이
                                marginRight: barSpacing,
                            }}
                        >
                            <View
                                className="bg-black rounded-sm"
                                style={{
                                    width: barWidth,
                                    height: barHeight,
                                }}
                            />
                        </View>
                    );
                })}
                {(isRecording || isPaused) && (
                    <View
                        className="flex-col justify-center"
                        style={{
                            width: barWidth,
                            height: 60,
                            marginRight: barSpacing,
                        }}
                    >
                        <View
                            className="bg-gray-300 rounded-sm"
                            style={{
                                width: barWidth,
                                height: 2,
                                marginBottom: 2,
                            }}
                        />
                        <View
                            className="bg-gray-300 rounded-sm"
                            style={{
                                width: barWidth,
                                height: 2,
                            }}
                        />
                    </View>
                )}
            </Animated.View>
        </View>
    );
}
