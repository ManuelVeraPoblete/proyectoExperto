import { apiClient } from '@/lib/apiClient';
import { ApiExperto } from '@/lib/expertoMapper';

// ─── Tipos ────────────────────────────────────────────────────────────────────
export interface ExpertoBusquedaParams {
  work?: string;
  category_id?: string;
  rating?: string;
  region?: string;
  provincia?: string;
  comuna?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const buildSearchParams = (params: ExpertoBusquedaParams): URLSearchParams => {
  const urlParams = new URLSearchParams();
  (Object.entries(params) as [string, string | undefined][]).forEach(([key, value]) => {
    if (value !== undefined && value !== '') urlParams.set(key, value);
  });
  return urlParams;
};

// ─── Servicio ─────────────────────────────────────────────────────────────────
export const expertoService = {
  search: (params: ExpertoBusquedaParams): Promise<ApiExperto[]> => {
    const searchParams = buildSearchParams(params);
    return apiClient.get<ApiExperto[]>(`/experts?${searchParams.toString()}`);
  },

  getReviews: (expertoId: string): Promise<any[]> => {
    return apiClient.get<any[]>(`/experts/${expertoId}/reviews`);
  },
};
