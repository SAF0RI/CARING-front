import { Text, TouchableOpacity, View } from 'react-native';
import { Icon } from '../svg';

export const CallForHelpButton = ({
    onPress,
}: {
    onPress?: () => void;
}) => {
    return (
        <TouchableOpacity className='flex flex-row items-center justify-center bg-gray5 rounded-lg p-6 mt-8' onPress={onPress}>
            <View className='flex-1 flex-col items-center justify-start gap-1'>
                <Text className='text-gray90 text-lg text-left w-full'>도움이 필요하신가요?</Text>
                <View className='h-fit flex flex-row items-center justify-start gap-1 w-full'>
                    <Text className='text-main600 text-base text-left font-bold'>복지관에 문의하기</Text>
                    <Icon name="ChevronRightBlue" />
                </View>
            </View>
            <Icon name="Contact" />
        </TouchableOpacity>
    );
};