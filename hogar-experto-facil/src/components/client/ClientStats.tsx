import React from 'react';
import { Clock, CheckCircle, Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { expertoService } from '@/services/api/expertoService';
import StatCard from '@/components/shared/StatCard';

const ClientStats: React.FC = () => {
  const { user } = useAuth();

  const { data: stats } = useQuery({
    queryKey: ['user-stats', user?.id],
    queryFn: () => expertoService.getStats(user!.id),
    enabled: !!user?.id,
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <StatCard
        title="Trabajos Activos"
        value={stats ? String(stats.activeJobs) : '—'}
        icon={Clock}
        iconColor="text-blue-500"
      />

      <StatCard
        title="Trabajos Completados"
        value={stats ? String(stats.completedJobs) : '—'}
        icon={CheckCircle}
        iconColor="text-green-500"
      />

      <StatCard
        title="Calificación Promedio"
        value={stats?.avgCalificacion != null ? String(stats.avgCalificacion) : '—'}
        icon={Star}
        iconColor="text-yellow-500"
      />
    </div>
  );
};

export default ClientStats;
