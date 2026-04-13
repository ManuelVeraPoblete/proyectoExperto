import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { trabajoService } from '@/services/api/trabajoService';
import { Trabajo } from '@/types';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'en_proceso': return 'text-purple-600 bg-purple-50';
    case 'completado': return 'text-green-600 bg-green-50';
    case 'activo': return 'text-blue-600 bg-blue-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'en_proceso': return 'En Progreso';
    case 'completado': return 'Completado';
    case 'activo': return 'Activo';
    default: return status;
  }
};

const useMyJobs = () => {
  const { user } = useAuth();

  const { data: rawJobs = [], isLoading } = useQuery({
    queryKey: ['my-jobs', user?.id],
    queryFn: () => trabajoService.getMisTrabajos({ expertoId: user?.id }),
    enabled: !!user?.id && user?.userType === 'experto',
  });

  const activeJobs = useMemo(
    () => rawJobs.filter((j: Trabajo) => j.estado === 'en_proceso').map((j: Trabajo) => ({
      id: j.id,
      title: j.titulo,
      client: j.cliente_nombres ? `${j.cliente_nombres} ${j.cliente_apellidos ?? ''}`.trim() : 'Cliente',
      status: 'in-progress',
      date: new Date(j.createdAt ?? j.fechaCreacion).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' }),
      payment: j.presupuesto ? `$${Number(j.presupuesto).toLocaleString('es-CL')}` : 'A convenir',
      clientId: j.clientId,
    })),
    [rawJobs],
  );

  const completedJobs = useMemo(
    () => rawJobs.filter((j: Trabajo) => j.estado === 'completado').map((j: Trabajo) => ({
      id: j.id,
      title: j.titulo,
      client: j.cliente_nombres ? `${j.cliente_nombres} ${j.cliente_apellidos ?? ''}`.trim() : 'Cliente',
      status: 'completed',
      date: new Date(j.createdAt ?? j.fechaCreacion).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' }),
      payment: j.presupuesto ? `$${Number(j.presupuesto).toLocaleString('es-CL')}` : 'A convenir',
      rating: j.calificacion ?? null,
      comment: j.resena ?? '',
      clientId: j.clientId,
    })),
    [rawJobs],
  );

  return {
    activeJobs,
    completedJobs,
    isLoading,
    getStatusColor,
    getStatusText,
  };
};

export default useMyJobs;
