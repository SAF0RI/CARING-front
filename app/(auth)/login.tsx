import { useAuthStore } from "@/shared/model/store/authStore";
import { Icon } from "@/shared/ui";
import { Button, CallForHelpButton } from "@/shared/ui/buttons";
import { LoginInput } from "@/shared/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Image, Text, View } from "react-native";
import { z } from "zod";

export default function LoginScreen() {

    const login = useAuthStore((s) => s.login);
    const { control, handleSubmit, formState: { errors } } = useForm<{ password: string; phone: string }>({
        defaultValues: {
            phone: "",
            password: "",
        },
        resolver: zodResolver(z.object({
            phone: z.string().min(1, "전화번호를 입력해주세요."),
            password: z.string().min(1, "비밀번호를 입력해주세요."),
        })),
    });


    return (
        <View className="flex items-center justify-start px-4 pt-20 h-full w-full gap-4">
            <Image
                source={require('@/assets/images/img_logo_header.png')}
                className="h-16 w-full mt-16 mb-10"
                style={{ resizeMode: 'contain' }}
                accessibilityLabel="로그인 로고"
                accessibilityRole="image"
            />
            <LoginInput
                name="phone"
                control={control}
                placeholder="전화번호"
                keyboardType="phone-pad"
                error={errors?.phone?.message}
            />
            <LoginInput
                name="password"
                control={control}
                placeholder="비밀번호"
                secureTextEntry
                error={errors?.password?.message}
            />
            <Button onPress={handleSubmit(login)} size="lg" variant="filled" className="mt-4">
                <Text className="text-white font-bold">로그인</Text>
            </Button>
            <View className="w-full flex flex-row mt-4">
                <Button variant="text" layoutClassName="w-1/2" innerClassName="w-full flex flex-row items-center justify-center">
                    <Icon name="Account" />

                    <Text className="text-primary">아이디 찾기</Text>
                </Button>
                {/* divider */}
                <View className="border-x-[0.1px] h-full bg-gray40" />
                <Button variant="text" layoutClassName="w-1/2" innerClassName="w-full flex flex-row items-center justify-center">
                    <Icon name="Lock" />
                    <Text className="text-primary">비밀번호 찾기</Text>
                </Button>
            </View>
            <CallForHelpButton />
        </View >
    );
}


