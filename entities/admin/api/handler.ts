import { GetAxiosInstance, PostAxiosInstance } from "@/shared/axios/axios.method";
import { AdminOkResponse } from "./schema";

export const runMigration = async (): Promise<AdminOkResponse> => {
  const response = await PostAxiosInstance<AdminOkResponse>(
    "/admin/db/migrate"
  );
  return response.data;
};

export const initDatabase = async (): Promise<AdminOkResponse> => {
  const response = await PostAxiosInstance<AdminOkResponse>("/admin/db/init");
  return response.data;
};

export const getDatabaseStatus = async (): Promise<AdminOkResponse> => {
  const response = await GetAxiosInstance<AdminOkResponse>(
    "/admin/db/status"
  );
  return response.data;
};

