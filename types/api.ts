export interface ApiResponse<T = unknown> {
  success: boolean;
  status: number;
  message: string | null;
  data?: T;
  errors?: T;
}

