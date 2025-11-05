import { queries } from "@/entities";
import { NotificationResponse } from "@/entities/care/api/schema";
import { emotionKorMap } from "@/shared/lib/emotions";
import { EmotionIconComponent } from "@/shared/lib/emotions/components";
import { BackHeader, MainLayout } from "@/shared/ui";
import { formatDate } from "@/shared/util/format";
import { useQuery } from "@tanstack/react-query";
import { FlatList, RefreshControl, Text, View } from "react-native";

const NotificationItem = ({ item }: { item: NotificationResponse['notifications'][number] }) => {
    return (
        <View className="flex-row items-center justify-between gap-x-2">

            <EmotionIconComponent className="self-center my-auto" emotion={item.top_emotion === 'fear' ? 'anxiety' : item.top_emotion ?? 'unknown'} isBig={true} size={24} />

            <View className="flex-1">
                <Text className="text-[13px] text-gray70">{'마음일기'}</Text>
                <Text>{`${item.name}님이 ${emotionKorMap[item.top_emotion === 'fear' ? 'anxiety' : item.top_emotion ?? 'unknown']} 상태에요!`}</Text>
            </View>
            <View className="items-start h-full">
                <Text className="text-[13px] text-gray70">{formatDate(item.created_at)}</Text>
            </View>

        </View >
    );
};

export default function NotificationsScreen() {
    const userInfo = useQuery(queries.user.userInfo);

    const { data: notifications, refetch, isRefetching } = useQuery({
        ...queries.care.notifications(userInfo?.data?.username ?? ''),
        enabled: !!userInfo?.data?.username,
    });
    console.log({ notifications: notifications?.notifications.map((notification) => notification.top_emotion) });



    return (
        <MainLayout>
            <MainLayout.Header>
                <BackHeader title="알림" />
            </MainLayout.Header>
            <MainLayout.Content className="bg-gray5 flex-1 p-4" footer={false}>
                <FlatList
                    data={notifications?.notifications ?? []}
                    renderItem={({ item }) => <NotificationItem item={item} />}
                    keyExtractor={(item) => item.notification_id.toString()}
                    contentContainerClassName="gap-y-8"
                    showsVerticalScrollIndicator={false}
                    scrollEnabled
                    refreshControl={
                        <RefreshControl
                            refreshing={!!isRefetching}
                            onRefresh={refetch}
                        />
                    }
                    ListEmptyComponent={
                        <View className="flex-1 justify-center items-center">
                            <Text className="text-gray70 text-center text-lg">
                                알림이 없습니다.
                            </Text>
                        </View>
                    }
                />
            </MainLayout.Content>
        </MainLayout>
    );
}