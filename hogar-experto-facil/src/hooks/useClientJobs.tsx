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
  proposalCount?: number;
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
      proposalCount: t.proposalCount ?? 0,
    }));
  }, [rawJobs]);

  const closeJobMutation = useMutation({
    mutationFn: ({ jobId, calificacion, resena, files }: { jobId: string; calificacion: number; resena?: string; files?: File[] }) =>
      trabajoService.closeJob(jobId, { calificacion, resena, files }),
    onSuccess: () => {
      // Actualizar dashboard del cliente y trabajos del experto
      queryClient.invalidateQueries({ queryKey: ['client-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['my-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['my-active-jobs'] });
    },
  });

  const handleMaestroAssigned = (_jobId: string, _maestroId: string): void => {
    queryClient.invalidateQueries({ queryKey: ['client-jobs'] });
  };

  const handleJobClosed = (jobId: string, rating: number, review: string, files: File[] = []): Promise<void> =>
    new Promise((resolve, reject) => {
      closeJobMutation.mutate(
        { jobId, calificacion: rating, resena: review, files },
        { onSuccess: () => resolve(), onError: (err) => reject(err) },
      );
    });

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
