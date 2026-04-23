import { apiClient } from '@/lib/apiClient';
import { ExpertoVerificationStatus } from '@/constants';

// ─── Tipos ────────────────────────────────────────────────────────────────────
export interface AdminExpertoItem {
  id: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono?: string;
  especialidades: string[];
  verificationStatus: ExpertoVerificationStatus;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  activeExperts: number;
  jobsThisMonth: number;
}

export interface AuditLogItem {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetId: string | null;
  targetType: string | null;
  details: Record<string, unknown> | null;
  ip: string | null;
  createdAt: string;
}

export interface AuditLogsResponse {
  total: number;
  logs: AuditLogItem[];
}

// ─── Servicio ─────────────────────────────────────────────────────────────────
export const adminService = {
  getStats: (): Promise<AdminStats> =>
    apiClient.get<AdminStats>('/admin/stats'),

  getExpertos: (): Promise<AdminExpertoItem[]> =>
    apiClient.get<AdminExpertoItem[]>('/admin/experts'),

  updateExpertoStatus: (id: string, status: ExpertoVerificationStatus): Promise<void> =>
    apiClient.patch<void>(`/admin/experts/${id}/status`, { status }),

  getAuditLogs: (limit = 50, offset = 0): Promise<AuditLogsResponse> =>
    apiClient.get<AuditLogsResponse>(`/admin/audit-logs?limit=${limit}&offset=${offset}`),
};
