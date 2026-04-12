
import React from 'react';
import { Button } from '@/components/ui/button';
import ExpertoCard from '@/components/ExpertoCard';
import { expertos } from '@/lib/mock-data';
import useProtectedNavigation from '@/hooks/useProtectedNavigation';

const FeaturedExpertosSection = () => {
  const { handleProtectedLink } = useProtectedNavigation();

  const featuredExpertos = expertos.slice(0, 3);

  const handleContactClick = (expertoId: string, expertoName: string) => {
    console.log(`Contactar experto ${expertoId}: ${expertoName}`);
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
              calificacion={experto.rating}
              reviewCount={experto.reviews}
              comuna={experto.comuna}
              region={experto.region}
              experience="5+ años"
              hourlyRate={25000}
              isVerified={true}
              telefono=""
              direccion=""
              reviews={[]}
              completedJobs={[]}
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
