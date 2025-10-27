import { PostAxiosInstance } from "@/shared/axios/axios.method";

import {
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  SignUpResponse,
} from "./schema";

export const signIn = async ({
  username,
  password,
}: SignInRequest): Promise<SignInResponse> => {
  const response = await PostAxiosInstance<SignInResponse>("/sign-in", {
    username,
    password,
  });
  return response.data;
};

export const signUp = async ({
  name,
  birthdate,
  username,
  password,
  role,
  connecting_user_code,
}: SignUpRequest): Promise<SignUpResponse> => {
  const response = await PostAxiosInstance<SignUpResponse>("/sign-up", {
    name,
    birthdate,
    username,
    password,
    role,
    connecting_user_code,
  });
  return response.data;
};
