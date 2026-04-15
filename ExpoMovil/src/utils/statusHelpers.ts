import { JOB_STATUS_CONFIG, JobStatus } from '@/constants';

export const getStatusColor = (status: string): string =>
  JOB_STATUS_CONFIG[status as JobStatus]?.color ?? '#6B7280';

export const getStatusBg = (status: string): string =>
  JOB_STATUS_CONFIG[status as JobStatus]?.bg ?? '#F9FAFB';

export const getStatusText = (status: string): string =>
  JOB_STATUS_CONFIG[status as JobStatus]?.label ?? 'Desconocido';
