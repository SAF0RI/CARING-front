import { useRouter } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import { Icon } from "../svg";

export const HelpButton = () => {
    const router = useRouter();

    const handlePress = () => {
        router.push('/(help)/help');
    };
    return (
        <TouchableOpacity className="flex-row items-center justify-center gap-x-1" onPress={handlePress}>
            <Text className="text-main700 text-[15px] font-bold">도움말</Text>
            <Icon name="HeaderQuestionIcon" />
        </TouchableOpacity>
    );
};