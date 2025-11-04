import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { Platform } from "react-native";

// 안드로이드 에뮬레이터에서 localhost/127.0.0.1은 10.0.2.2로 변환
const getBaseUrl = () => {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000";

  // 안드로이드이고 localhost 또는 127.0.0.1을 사용하는 경우 10.0.2.2로 변환
  if (Platform.OS === "android") {
    if (baseUrl.includes("localhost")) {
      return baseUrl.replace("localhost", "10.0.2.2");
    }
    if (baseUrl.includes("127.0.0.1")) {
      return baseUrl.replace("127.0.0.1", "10.0.2.2");
    }
  }

  return baseUrl;
};

const BASE_URL = getBaseUrl();

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 60 * 1000 * 10,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    // 요청 시작 시간 기록
    (config as any).__requestStartTime = Date.now();
    // Add authorization token if available
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestDuration = error.config?.__requestStartTime
      ? Date.now() - error.config.__requestStartTime
      : null;

    if (error.response) {
      console.error("[Axios Error] Response:", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        duration: requestDuration ? `${requestDuration}ms` : "unknown",
      });
    } else if (error.request) {
      // 더 자세한 네트워크 에러 정보
      const requestInfo: any = {
        message: error.message,
        code: error.code,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        timeout: error.config?.timeout,
        duration: requestDuration ? `${requestDuration}ms` : "unknown",
      };

      // React Native의 네트워크 에러에서 추가 정보 추출
      if (error.request._response) {
        requestInfo.response = error.request._response;
      }
      if (error.request.status) {
        requestInfo.status = error.request.status;
      }
      // React Native의 XMLHttpRequest에서 추가 정보 추출
      if (error.request._timing) {
        requestInfo.timing = error.request._timing;
      }

      console.error("[Axios Error] No Response:", requestInfo);

      // 네트워크 연결 실패 시 추가 디버깅 정보
      if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
        const isStreamClosed = requestInfo.response === "Stream Closed";
        const isQuickFailure = requestDuration && requestDuration < 1000; // 1초 이내 실패

        console.error("[Network Debug]", {
          baseURL: error.config?.baseURL,
          fullUrl: `${error.config?.baseURL}${error.config?.url}`,
          platform: Platform.OS,
          duration: requestDuration,
          response: requestInfo.response,
          isStreamClosed,
          isQuickFailure,
          analysis: isStreamClosed
            ? "서버가 연결을 즉시 닫았습니다. 가능한 원인: 서버 과부하, 요청 거부, Keep-Alive 연결 문제"
            : isQuickFailure
              ? "연결이 시작되기 전에 실패했습니다. 가능한 원인: DNS 실패, 방화벽 차단, 네트워크 설정 문제"
              : "일반적인 네트워크 오류",
          possibleCauses: isStreamClosed
            ? [
                "서버가 요청을 처리하지 못함 (과부하/에러)",
                "Keep-Alive 연결이 서버에서 끊어짐",
                "서버가 요청을 거부함 (인증/권한 문제)",
                "프록시나 로드밸런서에서 연결 끊김",
              ]
            : [
                "DNS resolution failed",
                "Connection refused (server not responding)",
                "Network interface issue",
                "Android network security config issue",
              ],
        });
      }
    } else {
      console.error("[Axios Error] Request Setup:", {
        message: error.message,
        stack: error.stack,
        duration: requestDuration ? `${requestDuration}ms` : "unknown",
      });
    }
    return Promise.reject(error);
  }
);

export const GetAxiosInstance = async <T>(
  url: string,
  options?: AxiosRequestConfig
): Promise<{ data: T }> => {
  return axiosInstance.get<T>(url, options);
};

export const PostAxiosInstance = async <T>(
  url: string,
  data?: any,
  options?: AxiosRequestConfig
): Promise<{ data: T }> => {
  return axiosInstance.post<T>(url, data, options);
};

export const PutAxiosInstance = async <T>(
  url: string,
  data?: any,
  options?: AxiosRequestConfig
): Promise<{ data: T }> => {
  return axiosInstance.put<T>(url, data, options);
};

export const DeleteAxiosInstance = async <T>(
  url: string,
  options?: AxiosRequestConfig
): Promise<{ data: T }> => {
  return axiosInstance.delete<T>(url, options);
};
