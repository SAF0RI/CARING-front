
import { Text, TouchableOpacity, View } from 'react-native';
import { Icon } from '../svg';

type HeaderProps = {
    title: string;
    rightComponent?: React.ReactNode;
}

export const MainHeader = ({ title, rightComponent }: HeaderProps) => {

    return (
        <View className="w-full h-16 bg-white shadow-md border-b-[1px] border-gray10">
            <TouchableOpacity className="absolute left-4 h-16 flex justify-center">
                <Icon name="HeaderLogo" />
            </TouchableOpacity>
            <Text className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg text-gray100">
                {title}
            </Text>
            <TouchableOpacity className="absolute right-4 h-16 flex justify-center">
                {rightComponent}
            </TouchableOpacity>
        </View>
    );
};