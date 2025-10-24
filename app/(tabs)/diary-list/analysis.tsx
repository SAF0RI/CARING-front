import { BackHeader, Button, HelpButton, MainLayout } from "@/shared/ui";
import { ScrollView, Text, View } from "react-native";

export default function DiaryAnalysisScreen() {
    return (
        <MainLayout>
            <MainLayout.Header>
                <BackHeader title="일기 분석 결과" rightComponent={<HelpButton />} />
            </MainLayout.Header>

            <MainLayout.Content className="bg-gray5 flex-1 p-4">
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View className="bg-white rounded-[20px] p-6 gap-y-6">
                        <View className="items-center">
                            <Text className="text-main900 text-[20px] font-bold text-center">
                                나의 감정 분석 결과
                            </Text>
                            <Text className="text-gray70 text-[15px] mt-2 text-center">
                                지난 7일간의 일기를 분석한 결과입니다
                            </Text>
                        </View>

                        <View className="bg-main50 rounded-[16px] p-4">
                            <Text className="text-main700 text-[16px] font-bold mb-2">
                                주요 감정 패턴
                            </Text>
                            <Text className="text-gray70 text-[14px] leading-5">
                                평온한 감정이 60%, 즐거운 감정이 30%, 슬픈 감정이 10%로 나타났습니다.
                            </Text>
                        </View>

                        <View className="bg-gray10 rounded-[16px] p-4">
                            <Text className="text-gray90 text-[16px] font-bold mb-2">
                                감정 변화 추이
                            </Text>
                            <Text className="text-gray70 text-[14px] leading-5">
                                주말에는 더 긍정적인 감정을 보이며, 평일에는 조금 더 복잡한 감정을 경험하는 것으로 보입니다.
                            </Text>
                        </View>

                        <View className="bg-green50 rounded-[16px] p-4">
                            <Text className="text-green700 text-[16px] font-bold mb-2">
                                개선 제안
                            </Text>
                            <Text className="text-gray70 text-[14px] leading-5">
                                규칙적인 운동과 충분한 휴식을 통해 감정의 안정성을 높일 수 있습니다.
                            </Text>
                        </View>

                        <Button
                            size="lg"
                            variant="filled"
                            className="mt-4"
                        >
                            <Text className="text-white font-bold text-[16px]">상세 리포트 보기</Text>
                        </Button>
                    </View>
                </ScrollView>
            </MainLayout.Content>
        </MainLayout>
    );
}
