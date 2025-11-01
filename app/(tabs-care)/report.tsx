import { MainLayout, MainHeader } from "@/shared/ui";
import { Text, View } from "react-native";

export default function ReportScreen() {
    return (
        <MainLayout className="bg-gray-50">
            <MainLayout.Header>
                <MainHeader title="리포트" />
            </MainLayout.Header>
            <MainLayout.Content>
                <View className="flex-1 items-center justify-center">
                    <Text className="text-gray90 text-lg">리포트 화면</Text>
                </View>
            </MainLayout.Content>
        </MainLayout>
    );
}

