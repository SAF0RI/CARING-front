import { removeLocalUserInfo } from "@/entities/user/api";
import { Button } from "@/shared/ui/buttons";
import { HelpButton } from "@/shared/ui/buttons/help-button";
import { RingButton } from "@/shared/ui/buttons/ring-button";
import { Footer } from "@/shared/ui/footer";
import { BackHeader } from "@/shared/ui/header";
import { MainHeader } from "@/shared/ui/header/main-header";
import { MainLayout } from "@/shared/ui/layout";
import { useRouter } from "expo-router";
import { Text } from "react-native";

export default function DemoScreen() {

    const router = useRouter();

    return (
        <MainLayout>
            <MainLayout.Header>
                <MainHeader
                    title="마음일기"
                    rightComponent={<HelpButton />}
                />
                <MainHeader
                    title="마음일기"
                    rightComponent={<RingButton number={3} />}
                />
                <BackHeader
                    title="소속"
                    navigateTo="/demo"
                    rightComponent={<HelpButton />}
                />
            </MainLayout.Header>
            <MainLayout.Content className="space-y-4">
                <Button onPress={async () => {
                    await removeLocalUserInfo();
                    router.replace("/login");
                }} size="md" variant="outlined">
                    <Text className="text-primary">로그아웃</Text>
                </Button>
            </MainLayout.Content>
            <Footer />
        </MainLayout>
    );
}


