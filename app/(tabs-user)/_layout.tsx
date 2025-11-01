import { Icon } from "@/shared/ui/svg/SvgIcon";
import { Tabs } from "expo-router";

export default function UserTabsLayout() {
    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: "#152C4A",
            tabBarInactiveTintColor: "#D8D8D8",
        }}
        >
            <Tabs.Screen
                name="diary-list"
                options={{
                    title: "일기 리스트",
                    tabBarIcon: ({ focused }) => (
                        <Icon
                            name={focused ? "ListActive" : "ListDisabled"}
                            size={24}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="diary"
                options={{
                    title: "마음 일기",
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

