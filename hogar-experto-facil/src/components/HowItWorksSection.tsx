import React from 'react';

const HowItWorksSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            ¿Cómo funciona?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            En solo 3 pasos simples puedes encontrar al experto perfecto para tu trabajo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">1</span>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">
              Describe tu proyecto
            </h3>
            <p className="text-muted-foreground">
              Cuéntanos qué necesitas y te conectaremos con expertos especializados en tu área
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">2</span>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">
              Compara y elige
            </h3>
            <p className="text-muted-foreground">
              Revisa perfiles, calificaciones y presupuestos. Contacta directamente con quien prefieras
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">
              Trabajo terminado
            </h3>
            <p className="text-muted-foreground">
              El experto realiza el trabajo y tú calificas la experiencia para ayudar a otros usuarios
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
