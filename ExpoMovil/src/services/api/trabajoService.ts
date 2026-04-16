import { apiClient } from '@/lib/apiClient';
import { Trabajo } from '@/types';

export interface TrabajoBusquedaParams {
  descripcion?: string;
  categoryId?: string | string[];
  region?: string;
  provincia?: string;
  comuna?: string;
}

export interface ImageAsset {
  uri: string;
  name: string;
  type: string;
}

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

export const trabajoService = {
  search: (params: TrabajoBusquedaParams): Promise<Trabajo[]> => {
    const searchParams = buildSearchParams(params);
    return apiClient.get<Trabajo[]>(`/jobs?${searchParams.toString()}`);
  },

  getById: (id: string): Promise<Trabajo> =>
    apiClient.get<Trabajo>(`/jobs/${id}`),

  getMisTrabajos: (params: { expertoId?: string; clientId?: string; estado?: string }): Promise<Trabajo[]> => {
    const searchParams = new URLSearchParams();
    if (params.expertoId) searchParams.append('expertId', params.expertoId);
    if (params.clientId)  searchParams.append('clientId', params.clientId);
    if (params.estado)    searchParams.append('estado',   params.estado);
    return apiClient.get<Trabajo[]>(`/jobs?${searchParams.toString()}`);
  },

  create: (data: {
    titulo: string;
    descripcion: string;
    categoria: string;
    region: string;
    provincia: string;
    comuna: string;
    presupuesto: number;
  }): Promise<Trabajo> =>
    apiClient.post<Trabajo>('/jobs', data),

  createJob: (data: {
    titulo: string;
    descripcion: string;
    categoria: string;
    urgencia?: string;
    fechaPreferida?: string;
    region?: string;
    provincia?: string;
    comuna?: string;
    presupuesto?: number;
    images?: ImageAsset[];
  }): Promise<Trabajo> => {
    const formData = new FormData();
    formData.append('title', data.titulo);
    formData.append('description', data.descripcion);
    formData.append('category_id', data.categoria);
    if (data.urgencia)      formData.append('urgency',        data.urgencia);
    if (data.fechaPreferida) formData.append('preferred_date', data.fechaPreferida);
    if (data.region)        formData.append('region',         data.region);
    if (data.provincia)     formData.append('provincia',      data.provincia);
    if (data.comuna)        formData.append('comuna',         data.comuna);
    if (data.presupuesto)   formData.append('presupuesto',    String(data.presupuesto));
    data.images?.forEach(img => {
      formData.append('images', { uri: img.uri, name: img.name, type: img.type } as unknown as Blob);
    });
    return apiClient.postForm<Trabajo>('/jobs', formData);
  },

  closeJob: (id: string, data: { calificacion: number; resena?: string; images?: ImageAsset[] }): Promise<{ message: string; job: Trabajo }> => {
    if (data.images && data.images.length > 0) {
      const formData = new FormData();
      formData.append('calificacion', String(data.calificacion));
      if (data.resena) formData.append('resena', data.resena);
      data.images.forEach(img => {
        formData.append('photos', {
          uri: img.uri,
          name: img.name,
          type: img.type,
        } as unknown as Blob);
      });
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
