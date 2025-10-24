import { ActivityIndicator, Text, View } from "react-native";
import { Icon } from "../svg";
import { Button } from "./button";

export const AudioControlButton = ({ isPlaying, isBuffering, onPress }: { isPlaying: boolean, isBuffering: boolean, onPress: () => void }) => {
    return (
        <Button
            size="md"
            variant="filled"
            color={isPlaying || isBuffering ? "main" : "primary"}
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
                                {isPlaying ? "재생중" : "재생하기"}
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
    );
};