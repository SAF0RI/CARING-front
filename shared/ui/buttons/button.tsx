import { cn } from "@/shared/util/style";
import * as React from "react";
import { TouchableOpacity, TouchableOpacityProps, View } from "react-native";

export type ButtonProps = {
    children: React.ReactNode;
    variant?: "filled" | "outlined" | "text";
    color?: "primary";
    size?: "md" | "lg";
    className?: string;
    layoutClassName?: string;
    innerClassName?: string;
} & TouchableOpacityProps;


export const Button = ({
    children,
    variant = "filled",
    color = "primary",
    size = "md",
    className,
    layoutClassName,
    innerClassName,
    ...props
}: ButtonProps) => {
    const sizeClass = size === "lg" ? "mx-6 py-4" : "mx-4 py-3";
    const textSizeClass = size === "lg" ? "text-lg" : "text-md";

    const layoutClass = "w-auto flex justify-center items-center";


    const palette = {
        bg: variant === "filled" ? "bg-primary" : "bg-transparent",
        border: variant === "outlined" ? "border border-primary" : "",
        text: variant === "filled" ? "text-white" : "text-primary",
    };

    const containerClasses = cn([
        "rounded-md", variant === "text" ? "" : sizeClass, palette.bg, palette.border, layoutClass, className ?? "", innerClassName ?? "",
    ]
        .filter(Boolean)
    );

    return (
        <View className={cn(["w-full", layoutClassName ?? ""])}>
            <TouchableOpacity className={containerClasses} {...props}>
                <View className={cn(["font-semibold", textSizeClass, palette.text, innerClassName ?? ""])}>{children}</View>
            </TouchableOpacity>
        </View>
    );
};