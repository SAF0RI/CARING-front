import { Text, TouchableOpacity, View } from "react-native";
import { Icon } from "../svg";

export const SosButton = ({
    onPress,
}: {
    onPress: () => void;
}) => {
    return (
        <TouchableOpacity className="flex-row bg-red700 items-center justify-center rounded-lg px-2.5 py-2" onPress={onPress}>
            <View className="flex-row items-center">
                <View className="mr-2">
                    <Icon name="Bell" size={24} />
                </View>
                <Text className="text-lg font-bold text-gray1 h-[26px]">SOS 긴급 구조 요청하기</Text>
            </View>
        </TouchableOpacity>
    )
}