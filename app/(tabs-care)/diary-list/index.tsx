import { HelpButton, Icon, MainHeader, MainLayout } from "@/shared/ui";

import { queries } from "@/entities";
import { CareVoiceListItem } from "@/entities/care/api/schema";
import { emotionKorMap } from "@/shared/lib/emotions";
import { formatDate } from "@/shared/util/format";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { ActivityIndicator, FlatList, RefreshControl, Text, TouchableOpacity, View } from "react-native";

type DiaryListCardProps = {
    diary: CareVoiceListItem;
    onPress: () => void;
}

const DiaryListCard = ({ diary }: DiaryListCardProps) => {

    return (
        <TouchableOpacity
            className={`rounded-[20px] px-4 gap-y-2 bg-gray1 mx-4 py-4`}
            onPress={() => router.push(`/diary-list/${diary.voice_id}`)}
        >
            <View className="bg-gray10 rounded-full px-4 py-1 w-fit self-start">
                <Text className="text-gray90 text-[15px] font-semibold">{formatDate(diary.created_at)}</Text>
            </View>
            <View className="flex flex-row items-center justify-start">
                <Icon name="fear" size={24} />
                <View className="flex-1 ml-2">
                    <Text className="text-gray90 text-[15px] ">{'홍길동 님은'}</Text>
                    <Text className="text-gray90 text-[15px] font-semibold">{`${emotionKorMap[diary.emotion ?? 'unknown']} 상태에요!`}</Text>
                </View>
                <Icon name="ChevronRightBlack" size={24} />
            </View>


        </TouchableOpacity >
    );
};

export default function DiaryListScreen() {

    const { data: userInfo } = useQuery(queries.user.userInfo);

    const { data: diaries, refetch, isFetching } = useQuery({
        ...queries.care.careUserVoiceList(userInfo?.username ?? ''),
        enabled: !!userInfo?.username,
    });

    console.log({ diaries: diaries?.voices });

    const renderDiaryCard = ({ item }: { item: CareVoiceListItem }) => {
        return (
            <DiaryListCard
                diary={item}
                onPress={() => router.push(`/diary-list/${item.voice_id}`)}
            />
        );
    };


    return (
        <MainLayout>
            <MainLayout.Header>
                <MainHeader
                    title="일기 리스트"
                    rightComponent={<HelpButton />}
                />
            </MainLayout.Header>
            <MainLayout.Content className="bg-gray5 flex-1 p-0" footer={false}>
                {false ? (
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator size="large" color="#6366f1" />
                        <Text className="text-gray70 mt-4">일기를 불러오는 중...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={Array.from({ length: 10 }, () => diaries?.voices ?? []).flat()}
                        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={() => { refetch() }} />}
                        renderItem={renderDiaryCard}
                        ItemSeparatorComponent={() => <View className="h-5" />}
                        keyExtractor={(item, index) => `${item.voice_id}-${index}`}
                        contentContainerStyle={{ flexGrow: 1, marginTop: 20 }}
                        contentContainerClassName="gap-y-1"
                        showsVerticalScrollIndicator={false}
                        scrollEnabled
                        ListFooterComponent={() => <View className="h-20" />}
                        ListEmptyComponent={
                            <View className="flex-1 justify-center items-center">
                                <Text className="text-gray70 text-center text-lg">
                                    아직 저장된 일기가 없습니다
                                </Text>
                            </View>
                        }
                    />
                )}
            </MainLayout.Content>
        </MainLayout>
    );
}
