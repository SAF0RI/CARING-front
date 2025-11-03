import { Emotion } from "@/entities/voices/api/schema";
import { Icon } from "@/shared/ui/svg";

export const EmotionIconComponent = ({ emotion, isBig, size, className }: { emotion: Emotion, isBig?: boolean, size?: number, className?: string }) => {
    switch (emotion) {
        case "unknown":
            return <Icon name="Spinner" size={size ?? (isBig ? 40 : 20)} className={className} />;
        case "fear":
            return <Icon name="fear" size={size ?? (isBig ? 40 : 20)} className={className} />;
        case "neutral":
            return <Icon name="neutral" size={size ?? (isBig ? 40 : 20)} className={className} />;
        case "angry":
            return <Icon name="angry" size={size ?? (isBig ? 40 : 20)} className={className} />;
        case "happy":
            return <Icon name="happy" size={size ?? (isBig ? 40 : 20)} className={className} />;
        case "sad":
            return <Icon name="sad" size={size ?? (isBig ? 40 : 20)} className={className} />;
        case "surprise":
            return <Icon name="surprise" size={size ?? (isBig ? 40 : 20)} className={className} />;
        default:
            return null;
    }
};