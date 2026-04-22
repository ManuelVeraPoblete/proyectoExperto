
import { Card, CardContent } from '@/components/ui/card';
import useProtectedNavigation from '@/hooks/useProtectedNavigation';

const ServiceCategories = () => {
  const { handleProtectedLink } = useProtectedNavigation();

  const handleCategoryClick = (category: string) => {
    handleProtectedLink(`/buscar?category=${category.toLowerCase()}`);
  };

  const categories = [
    {
      title: 'Plomería',
      description: 'Reparación de grifos, instalaciones, fugas',
      icon: '🔧',
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200'
    },
    {
      title: 'Electricidad',
      description: 'Instalaciones eléctricas, reparaciones',
      icon: '⚡',
      color: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200'
    },
    {
      title: 'Construcción',
      description: 'Ampliaciones, remodelaciones, obra gruesa',
      icon: '🏗️',
      color: 'bg-orange-50 hover:bg-orange-100 border-orange-200'
    },
    {
      title: 'Pisos y Cerámicas',
      description: 'Instalación de pisos, cerámicos, porcelanatos',
      icon: '🏠',
      color: 'bg-green-50 hover:bg-green-100 border-green-200'
    },
    {
      title: 'Pintura',
      description: 'Pintura interior, exterior, decorativa',
      icon: '🎨',
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200'
    },
    {
      title: 'Jardinería',
      description: 'Mantención de jardines, paisajismo',
      icon: '🌱',
      color: 'bg-green-50 hover:bg-green-100 border-green-200'
    },
    {
      title: 'Limpieza',
      description: 'Limpieza profunda, mantención',
      icon: '🧽',
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200'
    },
    {
      title: 'Reparaciones',
      description: 'Reparaciones generales del hogar',
      icon: '🔨',
      color: 'bg-muted/50 hover:bg-muted border-border'
    }
  ];

  return (
    <section className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            ¿Qué servicio necesitas?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tenemos expertos especializados en todas las áreas que necesitas para tu hogar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Card 
              key={category.title}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${category.color}`}
              onClick={() => handleCategoryClick(category.title)}
            >
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="font-semibold text-foreground mb-2">
                  {category.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {category.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceCategories;
