import { cn } from "@/shared/util/style";
import { ScrollView, View, ViewProps } from "react-native";
import { Footer } from "../footer";

export type LayoutProps = {
    children: React.ReactNode;
    className?: string;
    footer?: boolean;
    isScrollable?: boolean;
} & ViewProps;

export const MainLayout = ({ children, className, ...props }: LayoutProps) => {
    return (
        <View className={cn("flex-1 items-center justify-start bg-white w-full", className)} {...props}>
            {children}
        </View>
    );
}

export const LayoutContent = ({ children, className, footer = true, isScrollable = false, ...props }: LayoutProps) => {
    return (
        <>
            {isScrollable ?
                <ScrollView className={cn("flex-1 w-full", className)} {...props}>
                    {children}
                    {footer && <Footer />}
                </ScrollView>
                : <View className={cn("w-full py-8 px-4 flex-1", className)} {...props}>
                    {children}
                </View>}

            {!isScrollable && footer && <Footer />}
        </>

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