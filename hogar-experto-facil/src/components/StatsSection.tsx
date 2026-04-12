
import React from 'react';

const StatsSection = () => {
  const stats = [
    {
      number: '2,500+',
      label: 'Expertos Verificados',
      description: 'Profesionales calificados en nuestra plataforma'
    },
    {
      number: '15,000+',
      label: 'Trabajos Completados',
      description: 'Proyectos exitosos realizados'
    },
    {
      number: '4.8★',
      label: 'Calificación Promedio',
      description: 'Satisfacción garantizada'
    },
    {
      number: '24h',
      label: 'Tiempo de Respuesta',
      description: 'Conexión rápida con expertos'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Confían en nosotros
          </h2>
          <p className="text-lg text-muted-foreground">
            Miles de personas ya encontraron al experto perfecto
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {stat.number}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                {stat.label}
              </h3>
              <p className="text-sm text-muted-foreground">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
