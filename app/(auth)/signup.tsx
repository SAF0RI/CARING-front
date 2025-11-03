import { signUp, SignUpRequest } from "@/entities/user/api";
import { Role } from "@/entities/user/api/schema";
import { Button, InfoInput, MainLayout } from "@/shared/ui";
import { BackHeader } from "@/shared/ui/header";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Alert, Text, View } from "react-native";
import { z } from "zod";

export default function SignupScreen() {

    const router = useRouter();
    const { control, handleSubmit, trigger, setValue } = useForm<SignUpRequest & { confirmPassword: string }>({
        defaultValues: {
            name: "",
            birthdate: "2000.05.06",
            username: "",
            password: "",
            role: Role.USER,
            connecting_user_code: "",
            confirmPassword: "",
        },
        mode: "all",
        resolver: zodResolver(z.object({
            name: z.string().min(1, "이름을 입력해주세요."),
            birthdate: z.string().min(1, "생년월일을 입력해주세요."),
            username: z.string().min(1, "아이디를 입력해주세요."),
            password: z.string().min(1, "비밀번호를 입력해주세요."),
            role: z.nativeEnum(Role),
            // Role이 CARE인 경우만 입력함
            connecting_user_code: z.string().min(0, "사용자 아이디를 검색해주세요."),
            confirmPassword: z.string().min(1, "비밀번호를 다시 입력해주세요."),
        }).refine((data) => data.role === Role.CARE ? data.connecting_user_code.length > 0 : true, {
            message: "사용자 아이디를 검색해주세요.",
            path: ["connecting_user_code"],
        }).refine((data) => data.password === data.confirmPassword, {
            message: "비밀번호가 일치하지 않습니다.",
            path: ["confirmPassword"],
        })
        )
    });


    const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

    const { mutate: signUpMutation, isPending } = useMutation({
        mutationFn: signUp,
        onSuccess: () => {
            setCurrentStep(3);
        },
        onError: (error) => {
            Alert.alert("회원가입 실패", error.message);
        },
    });

    const role = useWatch({
        control,
        name: "role",
    });

    const connectingUserCode = useWatch({
        control,
        name: "connecting_user_code",
    });

    const handleNextFromStep1 = async () => {
        const ok = await trigger(["username", "password", "confirmPassword"]);
        if (ok) setCurrentStep(2);
    };

    const handleSubmitSignup = handleSubmit((data) => {
        signUpMutation(data);
    });


    return (
        <MainLayout>
            <MainLayout.Header>
                <BackHeader title="회원가입" />
            </MainLayout.Header>
            <MainLayout.Content className="bg-white h-full" footer={false}>
                {currentStep === 1 && (
                    <View className="flex flex-col h-full justify-between">
                        <View className="flex items-start justify-center px-4">
                            <Text className="font-bold text-2xl">회원가입을 위한 정보를</Text>
                            <Text className="font-bold text-2xl">입력해주세요.</Text>
                        </View>
                        <View className="flex-1 items-center justify-start gap-y-4 mx-4 mt-8">
                            <InfoInput
                                name="name"
                                control={control}
                                placeholder="이름"
                                secureTextEntry={false}
                                label="이름"
                                keyboardType="default"
                            />
                            <InfoInput
                                name="username"
                                control={control}
                                placeholder="아이디"
                                secureTextEntry={false}
                                label="아이디"
                                keyboardType="default"
                            />
                            <InfoInput
                                name="password"
                                control={control}
                                placeholder="비밀번호"
                                secureTextEntry={true}
                                label="비밀번호"
                                sublabel="비밀번호를 입력해주세요."
                                keyboardType="default"
                            />
                            <InfoInput
                                name="confirmPassword"
                                control={control}
                                placeholder="비밀번호 확인"
                                secureTextEntry={true}
                                label="비밀번호 확인"
                                sublabel="비밀번호를 다시 입력해주세요."
                                keyboardType="default"
                            />
                        </View>
                        <Button
                            onPress={handleNextFromStep1}
                            size="lg"
                            variant="filled"
                            className="mt-4 border"
                        >
                            <Text className="text-white font-bold">다음</Text>
                        </Button>
                    </View>
                )}

                {currentStep === 2 && (
                    <View className="h-full">
                        <View className="flex items-start justify-center px-4">
                            <Text className="font-bold text-2xl">사용자 역할을 선택해주세요.</Text>
                        </View>
                        <View className="flex-1 gap-y-4 px-4 mt-8">
                            <Text className="text-xl text-gray100 mb-2">보호자로 가입하시나요?</Text>
                            <View className="flex-row gap-x-3">
                                <Button
                                    size="md"
                                    layoutClassName="w-1/2"
                                    className="ml-0 mr-2 border border-main800"
                                    variant={role === Role.CARE ? "filled" : "outlined"}
                                    onPress={() => setValue("role", Role.CARE)}
                                >
                                    <Text className={role === Role.CARE ? "text-white" : ""}>네</Text>
                                </Button>
                                <Button
                                    size="md"
                                    layoutClassName="w-1/2"
                                    className="mr-0 ml-2 border border-main800"
                                    variant={role === Role.USER ? "filled" : "outlined"}
                                    onPress={() => setValue("role", Role.USER)}
                                >
                                    <Text className={role === Role.USER ? "text-white" : ""}>아니요</Text>
                                </Button>
                            </View>

                            {role === Role.CARE && (
                                <InfoInput
                                    name="connecting_user_code"
                                    control={control}
                                    placeholder="ex) 홍길동"
                                    secureTextEntry={false}
                                    label="피보호자 닉네임 검색"
                                    sublabel="피보호자의 내 정보에서 아이디를 확인해주세요."
                                    keyboardType="default"
                                />
                            )}
                        </View>

                        <View className="mt-4 flex flex-row w-full px-4">
                            <Button
                                onPress={() => setCurrentStep(1)}
                                size="lg"
                                variant="outlined"
                                layoutClassName="w-1/2"
                                className="ml-0 mr-2 border border-main800"
                            >
                                <Text>이전</Text>
                            </Button>
                            <Button
                                onPress={handleSubmitSignup}
                                size="lg"
                                variant="filled"
                                disabled={isPending || (role === Role.CARE && !connectingUserCode)}
                                layoutClassName="w-1/2 mx-0"
                                className={`mr-1 ml-2 border ${(isPending || (role === Role.CARE && !connectingUserCode)) ? "border-gray40" : "border-main800"}`}
                            >
                                <Text className="text-white font-bold">{isPending ? "회원가입 중..." : "회원가입하기"}</Text>
                            </Button>
                        </View>
                    </View>
                )}

                {currentStep === 3 && (
                    <View className="h-full">
                        <View className="flex items-center justify-center px-8 mt-20">
                            <Text className="font-bold text-2xl">회원가입이 완료되었습니다.</Text>
                        </View>
                        <View className="px-8 mt-10">
                            <Button
                                onPress={() => router.replace("/login")}
                                size="lg"
                                variant="filled"
                            >
                                <Text className="text-white font-bold">확인</Text>
                            </Button>
                        </View>
                    </View>
                )}
            </MainLayout.Content>
        </MainLayout>
    );
}
