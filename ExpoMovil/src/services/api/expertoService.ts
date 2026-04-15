import { apiClient } from '@/lib/apiClient';
import { ApiExperto } from '@/lib/expertoMapper';

export interface ExpertoBusquedaParams {
  work?: string;
  category_id?: string;
  rating?: string;
  region?: string;
  provincia?: string;
  comuna?: string;
}

export interface ExpertoStats {
  totalJobs: number;
  completedJobs: number;
  activeJobs: number;
  avgCalificacion: number | null;
  pendingJobs?: number;
}

const buildSearchParams = (params: ExpertoBusquedaParams): URLSearchParams => {
  const urlParams = new URLSearchParams();
  (Object.entries(params) as [string, string | undefined][]).forEach(([key, value]) => {
    if (value !== undefined && value !== '') urlParams.set(key, value);
  });
  return urlParams;
};

export const expertoService = {
  search: (params: ExpertoBusquedaParams): Promise<ApiExperto[]> => {
    const searchParams = buildSearchParams(params);
    return apiClient.get<ApiExperto[]>(`/experts?${searchParams.toString()}`);
  },

  getFeatured: (): Promise<ApiExperto[]> =>
    apiClient.get<ApiExperto[]>('/experts/featured'),

  getById: (userId: string): Promise<ApiExperto> =>
    apiClient.get<ApiExperto>(`/experts/${userId}`),

  updateProfile: (data: Record<string, unknown>): Promise<ApiExperto> =>
    apiClient.patch<ApiExperto>('/experts/profile', data),

  getStats: (userId: string): Promise<ExpertoStats> =>
    apiClient.get<ExpertoStats>(`/users/${userId}/stats`),
};
