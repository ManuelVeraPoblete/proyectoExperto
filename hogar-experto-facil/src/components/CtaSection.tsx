
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const CtaSection = () => {
  const { openAuthDialog } = useAuth();

  return (
    <section className="py-16 gradient-bg">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          ¿Eres un experto profesional?
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Únete a nuestra plataforma y conecta con miles de clientes que necesitan tus servicios
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="btn-primary" onClick={() => openAuthDialog('register')}>
            Unirse como Experto
          </Button>
          <Button size="lg" variant="outline" className="bg-card hover:bg-muted" onClick={() => openAuthDialog('login')}>
            Más Información
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
