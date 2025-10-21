import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { Icon } from '../svg';

type HeaderProps = {
    title: string;
    navigateTo?: string;
}

export const NavigationHeader = ({ title, navigateTo }: HeaderProps) => {
    const router = useRouter();

    const handlePress = () => {
        if (navigateTo) {
            router.push(navigateTo as any);
            return;
        }
        router.back();
    };

    return (
        <View className="w-full h-16 bg-white shadow-md border-b-[1px] border-gray10">
            <TouchableOpacity className="absolute left-4 h-16 flex justify-center" onPress={handlePress}>
                <Icon name="Back" />
            </TouchableOpacity>
            <Text className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg text-gray100">
                {title}
            </Text>
        </View>
    );
};