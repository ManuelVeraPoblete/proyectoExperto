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

  getMisTrabajos: (params: { expertoId?: string; clientId?: string; estado?: string }): Promise<Trabajo[]> => {
    const searchParams = new URLSearchParams();
    if (params.expertoId) searchParams.append('expertId',  params.expertoId);
    if (params.clientId)  searchParams.append('clientId',  params.clientId);
    if (params.estado)    searchParams.append('estado',    params.estado);
    return apiClient.get<Trabajo[]>(`/jobs?${searchParams.toString()}`);
  },

  closeJob: (id: string, data: { calificacion: number; resena?: string; files?: File[] }): Promise<{ message: string; job: Trabajo }> => {
    if (data.files && data.files.length > 0) {
      const formData = new FormData();
      formData.append('calificacion', String(data.calificacion));
      if (data.resena) formData.append('resena', data.resena);
      data.files.forEach(f => formData.append('photos', f));
      return apiClient.patchForm<{ message: string; job: Trabajo }>(`/jobs/${id}/close`, formData);
    }
    return apiClient.patch<{ message: string; job: Trabajo }>(`/jobs/${id}/close`, {
      calificacion: data.calificacion,
      resena: data.resena,
    });
  },

  applyToJob: (jobId: string, data: { mensaje: string; presupuesto_ofrecido?: number }): Promise<unknown> =>
    apiClient.post(`/jobs/${jobId}/apply`, data),
};
