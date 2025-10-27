// User Info to be stored in AsyncStorage
export interface UserInfo {
  user_code: string;
  username: string;
  name: string;
  role: string;
}

// Storage Key
export const USER_STORAGE_KEY = "@user_info";

// Request Types
export interface SignInRequest {
  username: string;
  password: string;
}

export interface SignUpRequest {
  name: string;
  birthdate: string;
  username: string;
  password: string;
  role: string;
  connecting_user_code: string;
}

// Response Types
export interface SignInResponse {
  message: string;
  username: string;
  name: string;
  role: string;
}

export interface SignUpResponse {
  message: string;
  user_code: string;
  username: string;
  name: string;
  role: string;
}

export type GetUserInfoResponse = UserInfo;
