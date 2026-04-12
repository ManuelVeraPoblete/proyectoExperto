import React from 'react';
import { Button } from '@/components/ui/button';
import ExpertoCard from '@/components/ExpertoCard';
import { ExpertoCardData } from '@/types/experto';

// ─── Sub-componentes ──────────────────────────────────────────────────────────
const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center py-20">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
  </div>
);

interface EmptyStateProps {
  onClearFilters: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onClearFilters }) => (
  <div className="text-center py-12">
    <p className="text-muted-foreground text-lg">
      No se encontraron expertos con los criterios seleccionados
    </p>
    <Button variant="outline" className="mt-4" onClick={onClearFilters}>
      Limpiar Filtros
    </Button>
  </div>
);

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface ExpertosGridProps {
  expertos: ExpertoCardData[];
  isLoading: boolean;
  total: number;
  onContactExperto: (id: string, name: string) => void;
  onViewProfile: (experto: ExpertoCardData) => void;
  onClearFilters: () => void;
}

// ─── Componente ───────────────────────────────────────────────────────────────
const ExpertosGrid: React.FC<ExpertosGridProps> = ({
  expertos,
  isLoading,
  total,
  onContactExperto,
  onViewProfile,
  onClearFilters,
}) => {
  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      <div className="mb-6">
        <p className="text-muted-foreground">
          {total === 0
            ? 'No se encontraron expertos'
            : `Mostrando ${total} experto${total !== 1 ? 's' : ''} encontrado${total !== 1 ? 's' : ''}`
          }
        </p>
      </div>

      {expertos.length === 0 ? (
        <EmptyState onClearFilters={onClearFilters} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {expertos.map(experto => (
            <ExpertoCard
              key={experto.id}
              {...experto}
              onContactClick={onContactExperto}
              onViewProfile={onViewProfile}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default ExpertosGrid;
