import { Diary } from "@/shared/type";
import { cn } from "@/shared/util/style";
import { Text, View } from "react-native";
import { Icon } from "../../svg";

export const EmotionIconComponent = ({ emotion, isBig }: { emotion: Diary['emotion'], isBig: boolean }) => {
    switch (emotion) {
        case "anxiety":
            return <Icon name={isBig ? "anxietyBig" : "anxiety"} size={isBig ? 40 : 20} />;
        case "calm":
            return <Icon name={isBig ? "calmBig" : "calm"} size={isBig ? 40 : 20} />;
        case "happy":
            return <Icon name={isBig ? "happyBig" : "happy"} size={isBig ? 40 : 20} />;
        case "sad":
            return <Icon name={isBig ? "sadBig" : "sad"} size={isBig ? 40 : 20} />;
        default:
            return null;
    }
};


export const EmotionComponent = ({
    showAiAnalysisText = false,
    emotion = 'calm',
    isBig = false,
    className,
}: {
    showAiAnalysisText?: boolean;
    emotion?: Diary['emotion'],
    isBig?: boolean;
    className?: string;
}) => {
    const bgColorMap = {
        anxiety: 'bg-anxietyBg',
        calm: 'bg-calmBg',
        happy: 'bg-happyBg',
        sad: 'bg-sadBg',
    }
    const textColorMap = {
        anxiety: 'text-anxietyText',
        calm: 'text-calmText',
        happy: 'text-happyText',
        sad: 'text-sadText',
    }
    const bgColor = bgColorMap[emotion];
    const textColor = textColorMap[emotion];

    const emotionText: Record<Diary['emotion'], string> = {
        anxiety: '불안',
        calm: '평온',
        happy: '즐거움',
        sad: '슬픔',
    }

    return (
        <View className={cn([`rounded-full`, bgColor, 'flex-row items-center justify-center px-3 py-1 gap-x-1', className])}>
            {showAiAnalysisText && <Text className="text-gray90 text-[15px] font-semibold">{'AI 분석 : '}</Text>}
            <EmotionIconComponent emotion={emotion} isBig={isBig} />
            <Text className={cn([textColor, 'text-[15px] font-semibold'])}>{emotionText[emotion]}</Text>
        </View>
    );
};

