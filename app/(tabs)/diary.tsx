import { AlertHeader } from "@/shared/ui/header";
import { MainLayout } from "@/shared/ui/layout";
import { Text, View } from "react-native";

export default function DiaryScreen() {
    return (
        <MainLayout className="bg-gray-50">
            <MainLayout.Header>
                <AlertHeader
                    leftText="마음일기"
                    rightText="도움말"
                    onLeftTextPress={() => { }}
                    onRightTextPress={() => { }}
                    onAlertButtonPress={() => { }}
                />
            </MainLayout.Header>
            <MainLayout.Content>
                <View className="rounded-[20px] bg-white">
                    <Text className="text-xl font-bold">오늘 가장 즐거웠던 일은 무엇인가요?</Text>
                </View>
            </MainLayout.Content>
        </MainLayout>
    );
}
