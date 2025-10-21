import * as React from 'react';
import { Control, Controller, RegisterOptions } from 'react-hook-form';
import { Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import { Icon } from '../svg/SvgIcon';

type RNLoginInputProps = {
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'number-pad' | 'decimal-pad' | 'numeric' | 'email-address' | 'phone-pad';
    testID?: string;
    onClear?: () => void;
    error?: string;
} & Omit<TextInputProps, 'placeholder' | 'value' | 'secureTextEntry' | 'onChangeText' | 'keyboardType'>;

const RNLoginInput = ({ placeholder, value, onChangeText, secureTextEntry = false, keyboardType = 'default', testID, onClear, error, ...rest }: RNLoginInputProps) => {
    const [isSecure, setIsSecure] = React.useState<boolean>(!!secureTextEntry);

    const showClear = value?.length > 0;
    const showEye = !!secureTextEntry;

    return (
        <>
            <View className="w-full mt-4 relative">
                <TextInput
                    className={`w-full h-fit px-3 py-5 pr-14 border rounded-lg text-lg ${rest?.editable === false ? 'bg-gray10' : ''} ${rest?.autoCapitalize ? '' : ''} ${rest?.style ? '' : ''} ${rest?.placeholderTextColor ? '' : ''} ${'border-gray40'}`}
                    placeholder={placeholder}
                    secureTextEntry={isSecure}
                    value={value}
                    onChangeText={onChangeText}
                    keyboardType={keyboardType}
                    testID={testID || `input-${placeholder}`}
                    accessibilityLabel={placeholder}
                    {...rest}
                />

                <View className="absolute right-3 top-1/2 -translate-y-1/2 flex-row items-center gap-3">
                    {showEye && (
                        <TouchableOpacity activeOpacity={0.6} onPress={() => setIsSecure((v) => !v)}>
                            <Icon name={isSecure ? 'EyeVisible' : 'EyeRemove'} size={22} />
                        </TouchableOpacity>
                    )}
                    {showClear && (
                        <TouchableOpacity activeOpacity={0.6} onPress={onClear}>
                            <Icon name="Close" size={22} />
                        </TouchableOpacity>
                    )}
                </View>

            </View>
            {error && (
                <View className="w-full">
                    <Text className="text-red-600 mt-1 text-left text-base">
                        {error}
                    </Text>
                </View>
            )}
        </>
    );
};

export type RHFLoginInputProps = {
    name: string;
    control: Control<any>;
    rules?: RegisterOptions;
    placeholder: string;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'number-pad' | 'decimal-pad' | 'numeric' | 'email-address' | 'phone-pad';
    testID?: string;
    error?: string;
} & Omit<TextInputProps, 'placeholder' | 'value' | 'secureTextEntry' | 'onChangeText' | 'keyboardType'>;

export const LoginInput = ({ name, control, rules, placeholder, secureTextEntry, keyboardType = 'default', testID, error, ...rest }: RHFLoginInputProps) => {
    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
                <RNLoginInput
                    placeholder={placeholder}
                    value={value ?? ''}
                    onChangeText={onChange}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    testID={testID}
                    onClear={() => onChange('')}
                    error={error?.message}
                    {...rest}
                />
            )}
        />
    );
};