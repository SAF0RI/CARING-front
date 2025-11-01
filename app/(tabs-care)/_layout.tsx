import { Icon } from "@/shared/ui/svg/SvgIcon";
import { Tabs } from "expo-router";

export default function CareTabsLayout() {
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
                        <Icon
                            name={focused ? "HomeActive" : "HomeDisabled"}
                            size={24}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="diary-list"
                options={{
                    title: "리스트",
                    tabBarIcon: ({ focused }) => (
                        <Icon
                            name={focused ? "ListActive" : "ListDisabled"}
                            size={24}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="report"
                options={{
                    title: "리포트",
                    tabBarIcon: ({ focused }) => (
                        <Icon
                            name={focused ? "NoteActive" : "NoteDisabled"}
                            size={24}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="account"
                options={{
                    title: "내 정보",
                    tabBarIcon: ({ focused }) => (
                        <Icon
                            name={focused ? "AccountActive" : "AccountDisabled"}
                            size={24}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}

