import HttpHelpers from "@/services/helpers";
import { ApiResponse } from "@/types/api";
import { LoginDataType } from "@/types/auth";
import { AxiosResponse } from "axios";

export const login = (
  data: LoginDataType
): Promise<ApiResponse<{ token: string }>> => {
  return HttpHelpers.unauthenticated
    .post<ApiResponse<{ token: string }>>("auth/login", data)
    .then(
      (response: AxiosResponse<ApiResponse<{ token: string }>>) => response.data
    );
};
