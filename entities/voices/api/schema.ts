// Voice Upload Request
export interface UploadVoiceRequest {
  file: {
    uri: string;
    type: string;
    name: string;
  };
  username: string;
}

// Voice Upload Response
export interface UploadVoiceResponse {
  message: string;
  voiceId?: string;
  fileUrl?: string;
}
