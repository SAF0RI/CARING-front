import * as Haptics from "expo-haptics";
import * as React from "react";
import {
    type GestureResponderEvent,
    Pressable as RNPressable,
    type PressableProps as RNPressableProps,
    StyleProp,
    Vibration,
    ViewStyle,
} from "react-native";

type VibrationOption = boolean | "light" | "medium" | "heavy" | number;

export type PressableProps = Omit<RNPressableProps, "style"> & {
    children?: React.ReactNode;
    className?: string;
    style?: StyleProp<ViewStyle>;
    activeOpacity?: number; // 눌림 시 불투명도
    vibration?: VibrationOption; // 진동/햅틱 옵션
};

function triggerVibration(option: VibrationOption | undefined) {
    if (!option) return;
    if (typeof option === "number") {
        Vibration.vibrate(option);
        return;
    }
    if (option === true || option === "light") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        return;
    }
    if (option === "medium") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        return;
    }
    if (option === "heavy") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        return;
    }
}

// 현재는 사용 X, 추후 opacity 동작할 때 개발
export function Pressable({
    children,
    className,
    style,
    onPress,
    disabled,
    activeOpacity = 0.6,
    vibration,
    accessibilityRole = "button",
    ...rest
}: PressableProps) {
    const handlePress = React.useCallback((event: GestureResponderEvent) => {
        if (disabled) return;
        triggerVibration(vibration);
        onPress?.(event);
    }, [disabled, onPress, vibration]);

    return (
        <RNPressable
            accessibilityRole={accessibilityRole}
            className={className}
            disabled={disabled}
            onPress={handlePress}
            style={(state) => [
                // 외부에서 넘어온 style이 객체/배열 모두 허용
                style as any,
                // 눌림 효과가 마지막에 오도록 하여 우선 적용
                { opacity: state.pressed && !disabled ? activeOpacity : 1 },
            ]}
            {...rest}
        >
            {children}
        </RNPressable>
    );
}
