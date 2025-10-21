import { useAuthStore } from "@/shared/model/store/authStore";
import { Button } from "@/shared/ui/buttons";
import { AlertHeader } from "@/shared/ui/header";
import { MainLayout } from "@/shared/ui/layout";
import { Text } from "react-native";

export default function DemoScreen() {
    const logout = useAuthStore((s) => s.logout);
    return (
        <MainLayout>
            <MainLayout.Header>
                <AlertHeader
                    leftText="소속"
                    rightText="도움말"
                    onLeftTextPress={() => { }}
                    onRightTextPress={() => { }}
                    onAlertButtonPress={() => { }}
                />
            </MainLayout.Header>
            <MainLayout.Content className="space-y-4">
                <Button onPress={logout} size="md" variant="outlined">
                    <Text className="text-primary">로그아웃</Text>
                </Button>
            </MainLayout.Content>
        </MainLayout>
    );
}


