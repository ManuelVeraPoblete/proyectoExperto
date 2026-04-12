import { JOB_STATUS_CONFIG, JobStatus } from '@/constants';

/**
 * Retorna la clase CSS de color para un estado de trabajo.
 * Usa la configuración centralizada JOB_STATUS_CONFIG.
 */
export const getStatusColor = (status: string): string =>
  JOB_STATUS_CONFIG[status as JobStatus]?.colorClass ?? 'text-gray-600 bg-gray-50';

/**
 * Retorna la etiqueta en español para un estado de trabajo.
 * Usa la configuración centralizada JOB_STATUS_CONFIG.
 */
export const getStatusText = (status: string): string =>
  JOB_STATUS_CONFIG[status as JobStatus]?.label ?? 'Desconocido';
