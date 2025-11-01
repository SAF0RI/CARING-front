import { Emotion } from "@/entities/voices/api/schema";
import { cn } from "@/shared/util/style";
import { Text, View } from "react-native";
import { emotionBgColorMap, emotionKorMap, emotionTextColorMap } from "../constant";
import { EmotionIconComponent } from "./EmotionIconComponent";


export const EmotionComponentWithText = ({
    showAiAnalysisText = false,
    emotion = 'calm',
    isBig = false,
    className,
}: {
    showAiAnalysisText?: boolean;
    emotion?: Emotion,
    isBig?: boolean;
    className?: string;
}) => {
    const bgColor = emotionBgColorMap[emotion] ?? emotionBgColorMap['unknown'];
    const textColor = emotionTextColorMap[emotion] ?? emotionTextColorMap['unknown'];

    return (
        <View className={cn([`rounded-full`, bgColor, 'flex-row items-center justify-center px-3 py-1 gap-x-1', className])}>
            {showAiAnalysisText && <Text className="text-gray90 text-[15px] font-semibold">{'AI 분석 : '}</Text>}
            <EmotionIconComponent emotion={emotion} isBig={isBig} />
            <Text className={cn([textColor, 'text-[15px] font-semibold'])}>{emotionKorMap[emotion ?? 'unknown']}</Text>
        </View>
    );
};
