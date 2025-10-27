import { AudioPlayer, AudioStatus } from 'expo-audio';
import React, { useState } from 'react';
import { Dimensions, PanResponder, Text, View } from 'react-native';

interface AudioProgressProps {
    player: AudioPlayer;
    status: AudioStatus;
    onSeek?: (seconds: number) => void;
}

const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const AudioProgress: React.FC<AudioProgressProps> = ({
    player,
    status,
    onSeek,
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [dragPosition, setDragPosition] = useState(0);
    const screenWidth = Dimensions.get('window').width;
    const progressBarWidth = screenWidth - 32; // 좌우 패딩 고려

    const progress = status.duration > 0 ? status.currentTime / status.duration : 0;
    const currentPosition = isDragging ? dragPosition : progress;

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt) => {
            setIsDragging(true);
            const x = evt.nativeEvent.locationX;
            const newProgress = Math.max(0, Math.min(1, x / progressBarWidth));
            setDragPosition(newProgress);
        },
        onPanResponderMove: (evt) => {
            const x = evt.nativeEvent.locationX;
            const newProgress = Math.max(0, Math.min(1, x / progressBarWidth));
            setDragPosition(newProgress);
        },
        onPanResponderRelease: () => {
            setIsDragging(false);
            const seekTime = dragPosition * status.duration;
            player.seekTo(seekTime);
            onSeek?.(seekTime);
        },
    });

    return (
        <View className="w-full">
            <View className="relative h-2 w-full">
                <View
                    className="absolute top-0 left-0 h-2 bg-gray40 rounded-full"
                    style={{ width: '100%' }}
                />
                <View
                    className="absolute top-0 left-0 h-2 bg-main500 rounded-full"
                    style={{ width: `${currentPosition * 100}%` }}
                />

                <View
                    className="absolute -top-1/2 -translate-y-1/2"
                    style={{
                        left: `${currentPosition * 100}%`,
                        transform: [{ translateX: -8 }], // 원의 반지름만큼 왼쪽으로 이동
                    }}
                    {...panResponder.panHandlers}
                >
                    <View
                        className="w-4 h-4 bg-white rounded-full border-solid border-gray40 border-[1px]"
                    >
                        <View
                            className="w-2 h-2 bg-main500 rounded-full absolute top-1/2 left-1/2"
                            style={{
                                transform: [{ translateX: '-50%' }, { translateY: '-50%' }]
                            }}
                        />
                    </View>
                </View>
            </View>

            {/* Time Labels */}
            <View className="flex-row justify-between mt-2">
                <Text className="text-gray70 text-sm">
                    {formatTime(isDragging ? dragPosition * status.duration : status.currentTime)}
                </Text>
                <Text className="text-gray70 text-sm">
                    {formatTime(status.duration)}
                </Text>
            </View>
        </View>
    );
};
