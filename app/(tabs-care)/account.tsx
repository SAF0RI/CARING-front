import { removeLocalUserInfo } from "@/entities/user/api/storage";
import { Button } from "@/shared/ui";
import { router } from "expo-router";
import { Text, View } from "react-native";

export default function AccountScreen() {
    return (
        <View className="flex-1 items-center justify-center bg-white">
            <Button onPress={async () => {
                await removeLocalUserInfo();
                router.replace("/login");
            }} size="md" variant="outlined">
                <Text className="text-primary">로그아웃</Text>
            </Button>
        </View>
    );
}

