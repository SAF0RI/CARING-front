import { Text, TouchableOpacity, View } from "react-native";
import { Icon } from "./svg";

export const Footer = () => {
    return (
        <View className="flex-col p-4 h-[172px] w-full items-start justify-center bg-gray-50 gap-y-8">
            <Icon name="FooterLogo" />
            <View className="flex-row items-center justify-between gap-x-2">
                <TouchableOpacity className="">
                    <Text className="text-gray70 text-[15px]">케어링 이용약관</Text>
                </TouchableOpacity>
                <View className="w-[1px] h-[15px] bg-gray40" />
                <TouchableOpacity className="">
                    <Text className="text-gray70 text-[15px] font-bold">개인정보처리방침</Text>
                </TouchableOpacity>
            </View>
            <Text className="text-gray70 text-[15px]">© 2025 Sapori. All rights reserved.</Text>
        </View>
    );
};