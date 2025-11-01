import { Button, Footer, HelpButton, MainHeader, MainLayout } from "@/shared/ui";

import { queries } from "@/entities";
import { CareVoiceListItem } from "@/entities/care/api/schema";
import { Icon } from "@/shared/ui/svg";
import { formatDate } from "@/shared/util/format";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { ActivityIndicator, FlatList, RefreshControl, Text, TouchableOpacity, View } from "react-native";

type DiaryListCardProps = {
    diary: CareVoiceListItem;
    onPress: () => void;
}

const DiaryListCard = ({ diary, onPress }: DiaryListCardProps) => {

    return (
        <TouchableOpacity
            className={`rounded-[20px] px-4 gap-y-2 bg-gray1 mx-4`}
            onPress={() => router.push(`/diary-list/${diary.voice_id}`)}
        >
            <View className="bg-gray10 rounded-full px-4 py-1 w-fit self-start">
                <Text className="text-gray90 text-[15px] font-semibold">{formatDate(diary.created_at)}</Text>
            </View>
            <View className="flex flex-row items-center justify-start">
                <Icon name="anxiety" size={24} />
                <View className="flex-1 ml-2">
                    <Text className="text-gray90 text-[15px] ">{'홍길동 님은'}</Text>
                    <Text className="text-gray90 text-[15px] font-semibold">{`${diary.emotion} 상태에요!`}</Text>
                </View>
                <Icon name="ChevronRightBlack" size={24} />
            </View>


        </TouchableOpacity >
    );
};

export default function DiaryListScreen() {

    const { data: userInfo } = useQuery(queries.user.userInfo);

    const { data: diaries, refetch, isFetching } = useQuery({
        ...queries.care.careUserVoiceList(userInfo?.username ?? 'care'),
    });

    const renderDiaryCard = ({ item }: { item: CareVoiceListItem }) => {
        return (
            <DiaryListCard
                diary={item}
                onPress={() => router.push(`/diary-list/${item.voice_id}`)}
            />
        );
    };

    const demoData = {
        voice_id: 1,
        created_at: '2025-10-31T16:38:58',
        emotion: 'angry',
    }

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
                        data={diaries?.voices ?? [
                            demoData,
                        ]}
                        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={() => { refetch() }} />}
                        renderItem={renderDiaryCard}
                        ItemSeparatorComponent={() => <View className="h-5" />}
                        keyExtractor={(item) => item.voice_id.toString()}
                        ListHeaderComponent={() => <View className="w-full h-[172px] bg-main50 flex items-center justify-center rounded-b-[20px]">
                            <Text className="text-gray90 text-[15px]">나를 더 알아가는 시간</Text>
                            <Text className="text-xl font-bold">
                                <Text className="text-main700">내 마음</Text>은 어땠을까요?
                            </Text>
                            <Button
                                size="md"
                                variant="filled"
                                className="mx-20 mt-4"
                                hasArrow
                                onPress={() => router.push('/diary-list/analysis')}
                            >
                                <Text className="text-white font-bold text-[17px]">분석 결과 보기</Text>
                            </Button>
                        </View>}
                        contentContainerStyle={{ flexGrow: 1 }}
                        contentContainerClassName="gap-y-4"
                        showsVerticalScrollIndicator={false}
                        scrollEnabled
                        ListEmptyComponent={
                            <View className="flex-1 justify-center items-center">
                                <Text className="text-gray70 text-center text-lg">
                                    아직 저장된 일기가 없습니다
                                </Text>
                            </View>
                        }
                        ListFooterComponent={() => <Footer />}
                    />
                )}
            </MainLayout.Content>
        </MainLayout>
    );
}
