import { Emotion } from "@/entities/voices/api/schema";
import { Icon } from "@/shared/ui/svg";

export const EmotionIconComponent = ({ emotion, isBig }: { emotion: Emotion, isBig: boolean }) => {
    switch (emotion) {
        case "unknown":
            return <Icon name="Spinner" size={isBig ? 40 : 20} />;
        case "anxiety":
            return <Icon name={isBig ? "anxietyBig" : "anxiety"} size={isBig ? 40 : 20} />;
        case "calm":
            return <Icon name={isBig ? "calmBig" : "calm"} size={isBig ? 40 : 20} />;
        case "happy":
            return <Icon name={isBig ? "happyBig" : "happy"} size={isBig ? 40 : 20} />;
        case "sad":
            return <Icon name={isBig ? "sadBig" : "sad"} size={isBig ? 40 : 20} />;
        case "surprise":
            return <Icon name="Surprise" size={isBig ? 40 : 20} />;
        default:
            return null;
    }
};