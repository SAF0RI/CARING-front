import { queries } from "@/entities";
import { signIn } from "@/entities/user/api";
import { Role, UserInfo } from "@/entities/user/api/schema";
import { setLocalUserInfo } from "@/entities/user/api/storage";
import { registerFcmTokenToServer, retryPendingDeactivate } from "@/shared/lib/fcm/token-management";
import { Button } from "@/shared/ui/buttons";
import { LoginInput } from "@/shared/ui/input";
import { Icon } from "@/shared/ui/svg";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { z } from "zod";

export default function LoginScreen() {

    const router = useRouter();
    const queryClient = useQueryClient();


    // 컴포넌트 마운트 시 pending deactivate 요청 재시도
    useEffect(() => {
        (async () => {
            try {
                const result = await retryPendingDeactivate();
                if (result.success) {
                    console.log("Pending FCM 토큰 비활성화 재시도 성공");
                } else {
                    console.error("Pending FCM 토큰 비활성화 재시도 실패:", result.error);
                }
            } catch (error) {
                console.error("Pending FCM 토큰 비활성화 재시도 중 오류:", error);
            }
        })();
    }, []);

    const { control, handleSubmit, setValue, formState: { errors } } = useForm<{ username: string; password: string; role: Role }>({
        defaultValues: {
            username: "",
            password: "",
            role: Role.USER,
        },
        resolver: zodResolver(z.object({
            username: z.string().min(1, "아이디를 입력해주세요."),
            password: z.string().min(1, "비밀번호를 입력해주세요."),
            role: z.nativeEnum(Role),
        })),
    });

    const { mutate: loginMutation, isPending } = useMutation({
        mutationFn: signIn,
        onSuccess: async (data) => {

            const userInfo: UserInfo = {
                user_code: data.username,
                username: data.username,
                name: data.name,
                role: data.role,
            };

            await setLocalUserInfo(userInfo);

            queryClient.setQueryData(queries.user.userInfo.queryKey, userInfo);

            try {
                await registerFcmTokenToServer(data.username);
            } catch (error) {
                console.error("FCM 토큰 등록 실패:", error);
            }

            if (data.role === Role.CARE) {
                router.replace("/(tabs-care)/home");
            } else {
                router.replace("/(tabs-user)/diary-list");
            }

        }
    });

    const role = useWatch({
        control,
        name: "role",
        defaultValue: Role.USER,
    });

    const insets = useSafeAreaInsets();

    return (
        <View className="flex items-center justify-start px-4 pt-20 h-full w-full gap-4"
            style={{
                paddingTop: insets.top + 80,
                paddingLeft: insets.left + 16,
                paddingBottom: insets.bottom,
                paddingRight: insets.right + 16,
            }}
        >
            <Image
                source={require('@/assets/images/img_logo_header.png')}
                className="h-16 w-full mt-16 mb-10"
                style={{ resizeMode: 'contain' }}
                accessibilityLabel="로그인 로고"
                accessibilityRole="image"
            />
            <LoginInput
                name="username"
                control={control}
                placeholder="아이디"
                keyboardType="default"
                error={errors?.username?.message}
            />
            <LoginInput
                name="password"
                control={control}
                placeholder="비밀번호"
                secureTextEntry
                error={errors?.password?.message}
            />
            <TouchableOpacity
                onPress={() =>
                    setValue(
                        "role",
                        role === Role.CARE ? Role.USER : Role.CARE,
                        { shouldDirty: true, shouldValidate: true }
                    )
                }
                className="flex flex-row w-full justify-start ml-4 items-center gap-x-2"
            >
                <Icon name={role === Role.CARE ? "RadioChecked" : "RadioDefault"} size={20} />
                <Text className={role === Role.CARE ? "text-main800 font-bold text-[17px]" : "text-gray-500 font-bold text-[17px]"}>
                    {"보호자로 로그인하기"}
                </Text>
            </TouchableOpacity>
            <Button
                onPress={handleSubmit((data) => loginMutation({ ...data, role: role }))}
                size="lg"
                variant="filled"
                className="mt-4 border border-main800"
                disabled={isPending}

            >
                <Text className="text-white font-bold">
                    {isPending ? "로그인 중..." : "로그인"}
                </Text>
            </Button>
            <Button
                onPress={() => router.push("/signup")}
                size="lg"
                variant="outlined"
                className="mt-4"
                disabled={isPending}
            >
                <Text className="text-main800 font-bold">
                    {"회원가입"}
                </Text>
            </Button>
        </View >
    );
}


