import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import ExpertoCard from '@/components/ExpertoCard';
import { expertoService } from '@/services/api/expertoService';
import { mapApiExpertoToCardData } from '@/lib/expertoMapper';
import useProtectedNavigation from '@/hooks/useProtectedNavigation';

const FeaturedExpertosSection = () => {
  const { handleProtectedLink } = useProtectedNavigation();

  const { data: rawExpertos = [] } = useQuery({
    queryKey: ['expertos-featured'],
    queryFn: () => expertoService.getFeatured(),
    staleTime: 5 * 60 * 1000,
  });

  const featuredExpertos = rawExpertos.map(mapApiExpertoToCardData);

  const handleContactClick = (_expertoId: string, _expertoName: string) => {
    // Contact handled inside ExpertoCard via navigation
  };

  return (
    <section className="py-16 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Expertos Destacados
          </h2>
          <p className="text-lg text-muted-foreground">
            Profesionales mejor calificados y más solicitados
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {featuredExpertos.map((experto) => (
            <ExpertoCard
              key={experto.id}
              id={experto.id}
              nombres={experto.nombres}
              apellidos={experto.apellidos}
              avatar={experto.avatar}
              especialidades={experto.especialidades}
              calificacion={experto.calificacion}
              reviewCount={experto.reviewCount}
              comuna={experto.comuna}
              region={experto.region}
              experience={experto.experience}
              hourlyRate={experto.hourlyRate}
              isVerified={experto.isVerified}
              telefono={experto.telefono}
              direccion={experto.direccion}
              reviews={experto.reviews}
              completedJobs={experto.completedJobs}
              onContactClick={handleContactClick}
            />
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" className="btn-primary" onClick={() => handleProtectedLink('/buscar')}>
            Ver Todos los Expertos
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedExpertosSection;
