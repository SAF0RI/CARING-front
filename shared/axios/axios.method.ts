import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 60 * 1000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
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
    if (error.response) {
      console.error("[Axios Error] Response:", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
      });
    } else if (error.request) {
      console.error("[Axios Error] No Response:", {
        message: error.message,
        code: error.code,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        timeout: error.config?.timeout,
      });
    } else {
      console.error("[Axios Error] Request Setup:", {
        message: error.message,
        stack: error.stack,
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
