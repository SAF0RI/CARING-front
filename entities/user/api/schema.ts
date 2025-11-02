export enum Role {
  CARE = "CARE",
  USER = "USER",
}
export interface UserInfo {
  user_code: string;
  username: string;
  name: string;
  role: Role;
}

export const USER_STORAGE_KEY = "@user_info";

export interface SignInRequest {
  username: string;
  password: string;
  role: Role;
}

export interface SignUpRequest {
  name: string;
  birthdate: string;
  username: string;
  password: string;
  role: Role;
  connecting_user_code: string;
}

export interface SignInResponse {
  message: string;
  username: string;
  name: string;
  role: Role;
}

export interface SignUpResponse {
  message: string;
  user_code: string;
  username: string;
  name: string;
  role: Role;
}

export interface UserInfoResponse {
  name: string;
  username: string;
  connected_care_name: string;
}

export type GetUserInfoResponse = UserInfo;
