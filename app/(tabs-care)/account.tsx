import { queries } from "@/entities";
import { removeLocalUserInfo } from "@/entities/user/api/storage";
import { Button, Icon, MainHeader, MainLayout } from "@/shared/ui";
import { cn } from "@/shared/util/style";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { Text, View } from "react-native";

export default function AccountScreen(

) {

    const userInfo = useQuery(queries.user.userInfo);

    const userPageInfo = useQuery({
        ...queries.care.careUserInfo(userInfo?.data?.username ?? ""),
        enabled: !!userInfo?.data?.username,
    });

    return (
        <MainLayout>
            <MainLayout.Header>
                <MainHeader title="내 정보" />
            </MainLayout.Header>
            <MainLayout.Content className="bg-gray5 flex-1 p-4 mx-0 px-0 py-0" footer={false}>
                <View className={cn(['flex-col w-full h-[172px] bg-main50 flex items-center justify-center rounded-b-[20px] px-4'])}>
                    <Icon name="ConnectIcon" size={24} />
                    <Text className="text-gray90 text-[19px]"><Text className="text-main600 text-[19px] font-bold">{userPageInfo?.data?.connected_user_name}</Text>님이</Text>
                    < Text className="text-gray90 text-[19px]">보호자로 연결되어 있습니다!</Text>
                </View>
                <View className="flex-col gap-y-4 px-4 py-4 h-full">
                    <Text className="text-gray90 text-[19px] font-bold">개인정보</Text>
                    <View className="flex-row items-center gap-x-2 bg-white rounded-lg p-4">
                        <Icon name="UserEmptyIcon" size={32} />
                        <Text className="text-gray90 text-[19px]">{userPageInfo?.data?.name}</Text>
                    </View>
                    <View className="flex-col items-start gap-x-2 gap-y-1 bg-white rounded-lg p-4">
                        <Text className="text-gray90 text-[19px]">아이디</Text>
                        <Text className="text-gray90 text-[19px]">{userPageInfo?.data?.username}</Text>
                    </View>
                    <Button onPress={async () => {
                        await removeLocalUserInfo();
                        router.replace("/login");
                    }} size="md" variant="text" className="self-start mt-4">
                        <Text className="text-gray50">로그아웃하기</Text>
                    </Button>
                </View>
            </MainLayout.Content>
        </MainLayout >

    );
}

