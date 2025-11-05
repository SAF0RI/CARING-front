import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, View } from 'react-native';

interface WaveformVisualizerProps {
    isRecording: boolean;
    isPaused?: boolean;
    durationMillis?: number;
    audioLevel?: number;
    waveformData?: number[];
    className?: string;
}

export function WaveformVisualizer({
    isRecording,
    isPaused = false,
    durationMillis = 0,
    audioLevel,
    waveformData,
    className = ""
}: WaveformVisualizerProps) {
    const scrollX = useRef(new Animated.Value(0)).current;
    const intervalRef = useRef<number | null>(null);
    const lastHeightRef = useRef<number>(0.5); // 이전 막대 높이를 추적
    const [internalWaveformData, setInternalWaveformData] = useState<number[]>([]);

    const containerWidth = 300; // 고정 컨테이너 너비
    const barWidth = 3;
    const barSpacing = 1;
    const totalBarWidth = barWidth + barSpacing;
    const maxVisibleBars = Math.floor(containerWidth / totalBarWidth); // 화면에 보이는 막대 수

    // waveformData가 제공되지 않으면 내부에서 생성
    const displayWaveformData = waveformData || internalWaveformData;

    // 녹음 중일 때 파형 데이터 생성 (100ms마다)
    useEffect(() => {
        if (isRecording && !isPaused) {
            intervalRef.current = setInterval(() => {
                // audioLevel이 제공되면 사용하고, 없으면 더 변동성이 큰 랜덤 값 생성
                let newBarHeight: number;

                if (audioLevel !== undefined) {
                    // audioLevel을 기반으로 하되 변동성 추가
                    const baseLevel = audioLevel;
                    const variation = (Math.random() - 0.5) * 0.8; // -0.4 ~ 0.4 변동
                    newBarHeight = Math.max(0.05, Math.min(1, baseLevel + variation));
                } else {
                    // 이전 값과의 연관성을 유지하면서도 큰 변동 허용
                    const randomChange = (Math.random() - 0.5) * 0.6; // -0.3 ~ 0.3
                    const newValue = lastHeightRef.current + randomChange;

                    // 가끔씩 큰 변화를 주기 (10% 확률로)
                    if (Math.random() < 0.1) {
                        newBarHeight = Math.random() * 0.9 + 0.1; // 완전히 새로운 값 0.1~1.0
                    } else {
                        // 일반적인 경우: 이전 값에서 조금씩 변화
                        newBarHeight = Math.max(0.1, Math.min(1, newValue));
                    }
                }

                // 매우 낮거나 높은 값도 가끔 생성 (더 다이나믹한 파형)
                if (Math.random() < 0.05) {
                    newBarHeight = Math.random() < 0.5 ? Math.random() * 0.2 + 0.05 : Math.random() * 0.3 + 0.7;
                }

                lastHeightRef.current = newBarHeight;
                setInternalWaveformData(prev => [...prev, newBarHeight]);
            }, 100);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRecording, isPaused, audioLevel]);

    // 녹음이 완전히 중지되거나 durationMillis가 0이 되면 파형 데이터 초기화
    useEffect(() => {
        if (durationMillis === 0 && internalWaveformData.length > 0) {
            setInternalWaveformData([]);
            lastHeightRef.current = 0.5; // 리셋
            scrollX.setValue(0);
        }
    }, [durationMillis, internalWaveformData.length, scrollX]);

    // 스크롤 애니메이션 (파형이 넘치면 우측으로 이동)
    useEffect(() => {
        if ((isRecording || isPaused) && displayWaveformData.length > maxVisibleBars) {
            const scrollAmount = (displayWaveformData.length - maxVisibleBars) * totalBarWidth;
            // 현재 스크롤 위치를 유지하면서 부드럽게 이동
            Animated.timing(scrollX, {
                toValue: -scrollAmount, // 음수로 왼쪽으로 이동
                duration: 50, // 매우 빠른 반응
                easing: Easing.linear, // 선형 애니메이션으로 밀리는 느낌 제거
                useNativeDriver: true,
            }).start();
        } else if (!isRecording && !isPaused && displayWaveformData.length === 0) {
            Animated.timing(scrollX, {
                toValue: 0,
                duration: 300, // 초기화도 부드럽게
                easing: Easing.out(Easing.cubic), // 부드러운 cubic easing 적용
                useNativeDriver: true,
            }).start();
        }
    }, [displayWaveformData.length, isRecording, isPaused, scrollX, maxVisibleBars, totalBarWidth]);

    return (
        <View
            className={`h-[60px] bg-transparent rounded-lg overflow-hidden ${className}`}
            style={{ width: containerWidth }}
        >
            <Animated.View
                className="flex-row items-center h-full"
                style={{
                    transform: [{ translateX: scrollX }],
                    paddingHorizontal: 4,
                }}
            >
                {displayWaveformData.map((height, index) => {
                    const barHeight = Math.max(4, height * 30); // 최소 4px, 최대 30px
                    return (
                        <View
                            key={index}
                            className="flex-col justify-center items-center"
                            style={{
                                width: barWidth,
                                height: 60, // 전체 높이
                                marginRight: barSpacing,
                            }}
                        >
                            <View
                                className="bg-main500 rounded-sm"
                                style={{
                                    width: barWidth,
                                    height: barHeight,
                                    maxHeight: 30,
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
