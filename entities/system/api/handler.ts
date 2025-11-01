import { GetAxiosInstance } from "@/shared/axios/axios.method";
import { HealthResponse } from "./schema";

export const getHealth = async (): Promise<HealthResponse> => {
  const response = await GetAxiosInstance<HealthResponse>("/health");
  return response.data;
};

