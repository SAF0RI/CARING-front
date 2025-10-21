import { Text, TouchableOpacity, View } from "react-native";
import { SosButton } from "../buttons";


export const AlertHeader = ({
    leftText,
    rightText,
    onLeftTextPress,
    onRightTextPress,
    onAlertButtonPress,
}: {
    leftText: string;
    rightText: string;
    onLeftTextPress: () => void;
    onRightTextPress: () => void;
    onAlertButtonPress: () => void;
}) => {
    return (
        <View className="left-0 right-0 z-10 w-full flex-column bg-gray1 h-32 border-b border-gray10 px-4 justify-evenly shadow-md shadow-black/10" style={{ elevation: 4 }}>
            <View className="flex-row items-center justify-between">
                <TouchableOpacity activeOpacity={0.5} onPress={onLeftTextPress}>
                    <View>
                        <Text className="text-sm font-bold text-main700">{leftText}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.5} onPress={onRightTextPress}>
                    <View>
                        <Text className="text-sm font-bold text-main700">{rightText}</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <SosButton onPress={onAlertButtonPress} />
        </View>
    )
}