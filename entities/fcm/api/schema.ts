export interface FcmTokenRegisterRequest {
  fcm_token: string;
  device_id?: string | null;
  platform?: string | null;
}

export interface FcmTokenRegisterResponse {
  message: string;
  token_id: number;
  is_active: boolean;
}

export interface FcmTokenDeactivateResponse {
  message: string;
  deactivated_count: number;
}

