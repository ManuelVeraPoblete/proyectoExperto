import { apiClient } from '@/lib/apiClient';
import { Trabajo } from '@/types';

// ─── Tipos ────────────────────────────────────────────────────────────────────
export interface TrabajoBusquedaParams {
  descripcion?: string;
  categoryId?: string | string[];
  region?: string;
  provincia?: string;
  comuna?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const buildSearchParams = (params: TrabajoBusquedaParams): URLSearchParams => {
  const urlParams = new URLSearchParams();

  if (params.descripcion) urlParams.append('descripcion', params.descripcion);
  if (params.region)      urlParams.append('region',      params.region);
  if (params.provincia)   urlParams.append('provincia',   params.provincia);
  if (params.comuna)      urlParams.append('comuna',      params.comuna);

  if (Array.isArray(params.categoryId)) {
    params.categoryId.forEach(id => urlParams.append('categoryId', String(id)));
  } else if (params.categoryId) {
    urlParams.append('categoryId', params.categoryId);
  }

  return urlParams;
};

// ─── Servicio ─────────────────────────────────────────────────────────────────
export const trabajoService = {
  search: (params: TrabajoBusquedaParams): Promise<Trabajo[]> => {
    const searchParams = buildSearchParams(params);
    return apiClient.get<Trabajo[]>(`/jobs?${searchParams.toString()}`);
  },

  getById: (id: string): Promise<Trabajo> =>
    apiClient.get<Trabajo>(`/jobs/${id}`),

  getMisTrabajos: (params: { expertoId?: string; clientId?: string; status?: string }): Promise<Trabajo[]> => {
    const searchParams = new URLSearchParams();
    if (params.expertoId) searchParams.append('expertoId', params.expertoId);
    if (params.clientId)  searchParams.append('clientId',  params.clientId);
    if (params.status)    searchParams.append('status',    params.status);
    return apiClient.get<Trabajo[]>(`/jobs?${searchParams.toString()}`);
  },
};
