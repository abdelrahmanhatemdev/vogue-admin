import HttpHelpers from '@/services/helpers';
import type { AxiosResponse } from 'axios';

// Define types for better type safety
interface LabelParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

const LabelsApiEndpoints = {
  addLabel: (data: Omit<Label, 'id'>): Promise<ApiResponse<Label>> => {
    return HttpHelpers.authenticated
      .post<ApiResponse<Label>>('labels', data)
      .then((response: AxiosResponse<ApiResponse<Label>>) => response.data);
  },
  
  editLabel: (id: string | number, data: Partial<Label>): Promise<ApiResponse<Label>> => {
    return HttpHelpers.authenticated
      .put<ApiResponse<Label>>(`labels/${id}`, data)
      .then((response: AxiosResponse<ApiResponse<Label>>) => response.data);
  },
  
  getLabels: (): Promise<ApiResponse<Label[]>> => {
    return HttpHelpers.authenticated
      .get<ApiResponse<Label[]>>('labels')
      .then((response: AxiosResponse<ApiResponse<Label[]>>) => response.data);
  },
};

export default LabelsApiEndpoints;