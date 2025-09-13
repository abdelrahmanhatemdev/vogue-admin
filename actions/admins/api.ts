import HttpHelpers from "@/services/helpers";
import type { AxiosResponse } from "axios";

// Define types for better type safety
interface AdminParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

export const getAdmins = (): Promise<ApiResponse<Admin[]>> => {
  return HttpHelpers.authenticated
    .get<ApiResponse<Admin[]>>("admins")
    .then((response: AxiosResponse<ApiResponse<Admin[]>>) => response.data);
};

export const addAdmin = (
  data: Omit<Admin, "id">
): Promise<ApiResponse<Admin>> => {
  return HttpHelpers.authenticated
    .post<ApiResponse<Admin>>("Admins", data)
    .then((response: AxiosResponse<ApiResponse<Admin>>) => response.data);
};

export const editAdmin = (
  id: string | number,
  data: Partial<Admin>
): Promise<ApiResponse<Admin>> => {
  return HttpHelpers.authenticated
    .put<ApiResponse<Admin>>(`Admins/${id}`, data)
    .then((response: AxiosResponse<ApiResponse<Admin>>) => response.data);
};


