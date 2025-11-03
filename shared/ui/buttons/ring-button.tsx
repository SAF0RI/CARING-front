import { Text, TouchableOpacity, View } from "react-native";
import { Icon } from "../svg";

export const RingButton = ({ number, onPress }: { number: number, onPress: () => void }) => {
    return (
        <TouchableOpacity className="flex-row items-center justify-center gap-x-1" onPress={onPress}>
            <View className="flex items-center justify-center w-4 h-4 px-1 bg-main700 rounded-full absolute top-0 right-0 z-10">
                <Text className="text-white text-[8px] font-bold">{number}</Text>
            </View>
            <Icon name="BellAlert" />
        </TouchableOpacity>
    );
};