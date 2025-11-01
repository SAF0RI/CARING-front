import { Icon } from "@/shared/ui/svg";
import { cn } from "@/shared/util/style";
import * as React from "react";
import { TouchableOpacity, TouchableOpacityProps, View } from "react-native";

export type ButtonProps = {
    children: React.ReactNode;
    variant?: "filled" | "outlined" | "text";
    color?: "primary" | "main";
    size?: "md" | "lg";
    className?: string;
    layoutClassName?: string;
    innerClassName?: string;
    hasArrow?: boolean;
} & TouchableOpacityProps;


export const Button = ({
    children,
    variant = "filled",
    color = "primary",
    size = "md",
    className,
    layoutClassName,
    innerClassName,
    hasArrow = false,
    disabled = false,
    ...props
}: ButtonProps) => {
    const sizeClass = size === "lg" ? "mx-6 py-4" : "mx-4 py-3";
    const textSizeClass = size === "lg" ? "text-lg" : "text-md";

    const layoutClass = "w-auto flex justify-center items-center";


    const palette = {
        bg: variant === "filled" ? disabled ? "bg-gray40" : "bg-main800" : "bg-transparent",
        border: variant === "outlined" ? disabled ? "border border-gray-40" : "border border-main800" : "",
        text: variant === "filled" ? disabled ? "text-gray100" : "text-white" : "text-primary",
    };

    const containerClasses = cn([
        "rounded-xl", variant === "text" ? "" : sizeClass, palette.bg, palette.border, layoutClass, className ?? "",
    ]
        .filter(Boolean)
    );

    return (
        <View className={cn(["w-full", layoutClassName ?? ""])}>
            <TouchableOpacity className={containerClasses} disabled={disabled} {...props}>
                <View className={cn(["font-semibold", textSizeClass, palette.text, innerClassName ?? "", hasArrow ? "flex-row items-center justify-center gap-x-1" : ""])}>{children}
                    {hasArrow && <Icon name={variant === "filled" ? "ChevronRightWhite" : "ChevronRightBlack"} />}
                </View>
            </TouchableOpacity>
        </View>
    );
};