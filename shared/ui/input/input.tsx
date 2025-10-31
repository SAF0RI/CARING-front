import { Control, Controller, RegisterOptions } from 'react-hook-form';
import { StyleProp, Text, TextInput, View, ViewStyle } from 'react-native';

interface LoginInputProps {
    placeholder: string;
    value: string;
    secureTextEntry?: boolean;
    handleInput: (text: string) => void;
    label?: string;
    sublabel?: string;
    error?: string;
    style?: StyleProp<ViewStyle>;
    children?: React.ReactNode;
}


const InfoInputInner = ({
    placeholder,
    value,
    handleInput,
    secureTextEntry = false,
    label,
    sublabel,
    error,
    style = {},
    children,
}: LoginInputProps) => {
    return (
        <View className="flex justify-start items-start w-full relative" style={style}>
            {label && <Text className="text-xl text-gray100 mb-2">{label}</Text>}
            {sublabel && <Text className="text-lg text-gray70 mb-1">{sublabel}</Text>}

            {children ?
                children : (
                    <TextInput
                        className={`w-full h-fit p-3 text-gray100 mt-1 rounded-lg text-lg border ${error ? 'border-red-600' : 'border-gray40'
                            }`}
                        placeholder={placeholder}
                        secureTextEntry={secureTextEntry}
                        value={value}
                        onChangeText={handleInput}
                        keyboardType="number-pad"
                    />)
            }

            {error && (
                <Text className="text-red-600 mt-1 text-left text-base">
                    {error}
                </Text>
            )}
        </View>
    );
};
type RHFInfoInputProps = Omit<LoginInputProps, 'value' | 'handleInput' | 'error'> & {
    name: string;
    control: Control<any>;
    rules?: RegisterOptions;
    children?: React.ReactNode;
};

export const InfoInput = ({
    name,
    control,
    rules,
    placeholder,
    secureTextEntry = false,
    label,
    sublabel,
    style = {},
    children,
}: RHFInfoInputProps) => {
    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
                <InfoInputInner
                    placeholder={placeholder}
                    value={value ?? ''}
                    handleInput={onChange}
                    secureTextEntry={secureTextEntry}
                    label={label}
                    sublabel={sublabel}
                    error={error?.message}
                    style={style}
                >
                    {/* @description : 다른 형태의 input일 경우 */}
                    {children}
                </InfoInputInner>
            )}
        />
    );
};