import { Text, TouchableOpacity } from "react-native";

export const ReadAllButton = () => {
    return (
        <TouchableOpacity>
            <Text className="text-main700 text-[15px] font-bold">모두 읽음</Text>
        </TouchableOpacity>
    );
};