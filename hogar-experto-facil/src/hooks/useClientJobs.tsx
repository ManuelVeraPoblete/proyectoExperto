import { useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { trabajoService } from '@/services/api/trabajoService';
import { JOB_STATUS, JobStatus } from '@/constants';
import { getStatusColor, getStatusText } from '@/utils/statusHelpers';
import { Trabajo } from '@/types';

// ─── Tipos ────────────────────────────────────────────────────────────────────
export interface ClientJob {
  id: number;
  title: string;
  experto: string | null;
  status: JobStatus | string;
  date: string;
  rating: number | null;
  description?: string;
  originalReview?: string;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
const useClientJobs = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // 1. Cargar trabajos reales del cliente
  const { data: rawJobs, isLoading } = useQuery({
    queryKey: ['client-jobs', user?.id],
    queryFn: () => trabajoService.getMisTrabajos({ clientId: user?.id || '' }),
    enabled: !!user?.id,
  });

  // Mapper de Trabajo (BD) a ClientJob (UI)
  const recentJobs: ClientJob[] = useMemo(() => {
    if (!rawJobs) return [];
    return rawJobs.map((t: Trabajo) => ({
      id: Number(t.id) || 0,
      title: t.titulo,
      experto: t.estado === JOB_STATUS.PENDING ? null : 'Maestro Asignado', // Aquí idealmente vendría el nombre del experto de la BD
      status: t.estado,
      date: new Date(t.fechaCreacion).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' }),
      rating: null, // Debería venir de una relación de reseñas
      description: t.descripcion,
    }));
  }, [rawJobs]);

  const handleMaestroAssigned = (_jobId: number, _maestroId: string): void => {
    // Aquí iría la llamada al servicio para asignar
    queryClient.invalidateQueries({ queryKey: ['client-jobs'] });
  };

  const handleJobClosed = (_jobId: number, _rating: number, _review: string): void => {
    // Aquí iría la llamada al servicio para cerrar
    queryClient.invalidateQueries({ queryKey: ['client-jobs'] });
  };

  const handleNewReview = (_jobId: number, _review: string): void => {
    // Aquí iría la llamada al servicio para reseñar
    queryClient.invalidateQueries({ queryKey: ['client-jobs'] });
  };

  return {
    recentJobs,
    isLoading,
    pendingJobs:    recentJobs.filter(j => j.status === JOB_STATUS.PENDING),
    inProgressJobs: recentJobs.filter(j => j.status === JOB_STATUS.IN_PROGRESS),
    completedJobs:  recentJobs.filter(j => j.status === JOB_STATUS.COMPLETED),
    getStatusColor,
    getStatusText,
    handleMaestroAssigned,
    handleJobClosed,
    handleNewReview,
  };
};

export default useClientJobs;
