import { Emotion } from "@/entities/voices/api/schema";
import { Icon } from "@/shared/ui/svg";

export const EmotionIconComponent = ({ emotion, isBig }: { emotion: Emotion, isBig: boolean }) => {
    switch (emotion) {
        case "unknown":
            return <Icon name="Spinner" size={isBig ? 40 : 20} />;
        case "fear":
            return <Icon name="fear" size={isBig ? 40 : 20} />;
        case "neutral":
            return <Icon name="neutral" size={isBig ? 40 : 20} />;
        case "angry":
            return <Icon name="angry" size={isBig ? 40 : 20} />;
        case "happy":
            return <Icon name="happy" size={isBig ? 40 : 20} />;
        case "sad":
            return <Icon name="sad" size={isBig ? 40 : 20} />;
        case "surprise":
            return <Icon name="surprise" size={isBig ? 40 : 20} />;
        default:
            return null;
    }
};