import { cn } from "@/shared/util/style";
import { View, ViewProps } from "react-native";

export type LayoutProps = {
    children: React.ReactNode;
    className?: string;
} & ViewProps;

export const MainLayout = ({ children, className, ...props }: LayoutProps) => {
    return (
        <View className={cn("flex-1 items-center justify-start bg-white w-full", className)} {...props}>
            {children}
        </View>
    );
}

export const LayoutContent = ({ children, className, ...props }: LayoutProps) => {
    return (
        <View className={cn("w-full py-8 px-4", className)} {...props}>
            {children}
        </View>
    );
}

export const LayoutHeader = ({ children, className, ...props }: LayoutProps) => {
    return (
        <View className={cn("w-full", className)} {...props}>
            {children}
        </View>
    );
}

MainLayout.Header = LayoutHeader;
MainLayout.Content = LayoutContent;

export default MainLayout;