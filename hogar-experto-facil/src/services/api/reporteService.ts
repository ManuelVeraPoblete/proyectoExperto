import { apiClient } from '@/lib/apiClient';

export interface ApiReport {
  id: number;
  type: 'review' | 'user' | 'post' | 'language';
  reason: string;
  description?: string;
  reporterId?: string;
  reportedUserId?: string;
  reportedContent?: string;
  status: 'pending' | 'reviewed' | 'resolved';
  Reporter?: { id: string; nombres: string; apellidos: string; email: string };
  ReportedUser?: { id: string; nombres: string; apellidos: string; email: string };
  createdAt: string;
}

export const reporteService = {
  create: (data: {
    type: ApiReport['type'];
    reason: string;
    description?: string;
    reportedUserId?: string;
    reportedContent?: string;
  }): Promise<{ message: string; report: ApiReport }> =>
    apiClient.post<{ message: string; report: ApiReport }>('/reports', data),

  getAll: (): Promise<ApiReport[]> =>
    apiClient.get<{ reports: ApiReport[]; total: number; page: number; totalPages: number }>('/reports')
      .then(res => res.reports),

  updateStatus: (id: number, status: ApiReport['status']): Promise<{ message: string; report: ApiReport }> =>
    apiClient.patch<{ message: string; report: ApiReport }>(`/reports/${id}`, { status }),
};
