import { apiClient } from '@/lib/apiClient';

export interface ApiApplication {
  id: number;
  jobId: string;
  expertId: string;
  mensaje: string;
  presupuesto_ofrecido?: number;
  estado: 'pendiente' | 'aceptado' | 'rechazado';
  Experto?: {
    id: string;
    nombres: string;
    apellidos: string;
    email: string;
    ExpertoProfile?: {
      bio?: string;
      region?: string;
      comuna?: string;
      avatar_url?: string;
      avg_calificacion?: number;
    };
  };
  Trabajo?: {
    id: string;
    titulo: string;
    descripcion: string;
    estado: string;
    region: string;
    comuna: string;
  };
  createdAt: string;
}

export const applicationService = {
  getForJob: (jobId: string): Promise<ApiApplication[]> =>
    apiClient.get<ApiApplication[]>(`/jobs/${jobId}/applications`),

  getMyApplications: (): Promise<ApiApplication[]> =>
    apiClient.get<ApiApplication[]>('/applications/mine'),

  accept: (applicationId: number): Promise<unknown> =>
    apiClient.patch(`/applications/${applicationId}`, { estado: 'aceptado' }),

  reject: (applicationId: number): Promise<unknown> =>
    apiClient.patch(`/applications/${applicationId}`, { estado: 'rechazado' }),
};
