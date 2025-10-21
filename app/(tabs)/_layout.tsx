import { Icon } from "@/shared/ui/svg/SvgIcon";
import { Tabs } from "expo-router";

export default function TabsLayout() {
    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: "#152C4A",
            tabBarInactiveTintColor: "#D8D8D8",
        }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "홈",
                    tabBarIcon: ({ focused }) => (
                        <Icon name={focused ? "HomeActive" : "HomeDisabled"} width={24} height={24} />
                    ),
                }}
            />
            <Tabs.Screen
                name="diary"
                options={{
                    title: "마음 일기",
                    tabBarIcon: ({ focused }) => (
                        <Icon name={focused ? "NoteActive" : "NoteDisabled"} width={24} height={24} />
                    ),
                }}
            />
            <Tabs.Screen
                name="account"
                options={{
                    title: "내 정보",
                    tabBarIcon: ({ focused }) => (
                        <Icon name={focused ? "AccountActive" : "AccountDisabled"} width={24} height={24} />
                    ),
                }}
            />
            <Tabs.Screen
                name="demo"
                options={{
                    title: "데모",
                    tabBarIcon: ({ focused }) => (
                        <Icon name={focused ? "AccountActive" : "AccountDisabled"} width={24} height={24} />
                    ),
                }}
            />
        </Tabs>
    );
}


