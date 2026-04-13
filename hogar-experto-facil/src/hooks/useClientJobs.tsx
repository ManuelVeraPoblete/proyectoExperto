import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { trabajoService } from '@/services/api/trabajoService';
import { JOB_STATUS, JobStatus } from '@/constants';
import { getStatusColor, getStatusText } from '@/utils/statusHelpers';
import { Trabajo } from '@/types';

// ─── Tipos ────────────────────────────────────────────────────────────────────
export interface ClientJob {
  id: string;
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

  const { data: rawJobs, isLoading } = useQuery({
    queryKey: ['client-jobs', user?.id],
    queryFn: () => trabajoService.getMisTrabajos({ clientId: user?.id }),
    enabled: !!user?.id,
  });

  const recentJobs: ClientJob[] = useMemo(() => {
    if (!rawJobs) return [];
    return rawJobs.map((t: Trabajo) => ({
      id: t.id,
      title: t.titulo,
      experto: t.Experto
        ? `${t.Experto.nombres} ${t.Experto.apellidos}`
        : t.estado === 'activo' ? null : 'Experto asignado',
      status: t.estado,
      date: new Date(t.createdAt ?? t.fechaCreacion).toLocaleDateString('es-CL', {
        day: '2-digit', month: 'short', year: 'numeric',
      }),
      rating: t.calificacion ?? null,
      description: t.descripcion,
      originalReview: t.resena,
    }));
  }, [rawJobs]);

  const closeJobMutation = useMutation({
    mutationFn: ({ jobId, calificacion, resena }: { jobId: string; calificacion: number; resena?: string }) =>
      trabajoService.closeJob(jobId, { calificacion, resena }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-jobs'] });
    },
  });

  const handleMaestroAssigned = (_jobId: string, _maestroId: string): void => {
    queryClient.invalidateQueries({ queryKey: ['client-jobs'] });
  };

  const handleJobClosed = (jobId: string, rating: number, review: string): void => {
    closeJobMutation.mutate({ jobId, calificacion: rating, resena: review });
  };

  const handleNewReview = (_jobId: string, _review: string): void => {
    queryClient.invalidateQueries({ queryKey: ['client-jobs'] });
  };

  return {
    recentJobs,
    isLoading,
    pendingJobs:    recentJobs.filter(j => j.status === 'activo'),
    inProgressJobs: recentJobs.filter(j => j.status === 'en_proceso'),
    completedJobs:  recentJobs.filter(j => j.status === 'completado'),
    getStatusColor,
    getStatusText,
    handleMaestroAssigned,
    handleJobClosed,
    handleNewReview,
    isClosingJob: closeJobMutation.isPending,
  };
};

export default useClientJobs;
