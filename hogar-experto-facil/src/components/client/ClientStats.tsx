
import React from 'react';
import { Clock, CheckCircle, Star } from 'lucide-react';
import StatCard from '@/components/shared/StatCard';

const ClientStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        title="Trabajos Activos"
        value="2"
        icon={Clock}
        iconColor="text-blue-500"
      />

      <StatCard
        title="Trabajos Completados"
        value="8"
        icon={CheckCircle}
        iconColor="text-green-500"
      />

      <StatCard
        title="Calificación Promedio"
        value="4.8"
        icon={Star}
        iconColor="text-yellow-500"
      />
    </div>
  );
};

export default ClientStats;
