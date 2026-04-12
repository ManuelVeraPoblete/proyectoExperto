import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import useProtectedNavigation from '@/hooks/useProtectedNavigation';
import { API_BASE_URL } from '@/lib/api-config';

const SearchHero = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<{id: number | string, name: string}[]>([
    { id: 'plomeria', name: 'Plomería' },
    { id: 'electricidad', name: 'Electricidad' }, 
    { id: 'construccion', name: 'Construcción' },
    { id: 'pisos', name: 'Pisos y Cerámicas' },
    { id: 'pintura', name: 'Pintura' },
    { id: 'jardineria', name: 'Jardinería' },
    { id: 'limpieza', name: 'Limpieza' },
    { id: 'reparaciones', name: 'Reparaciones Generales' }
  ]);
  const { handleProtectedLink } = useProtectedNavigation();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            const formattedCategories = data.map((cat: any) => ({
              id: cat.id,
              name: cat.nombre || cat.name
            })).filter(cat => cat.name && cat.id);
            
            if (formattedCategories.length > 0) {
              setCategories(formattedCategories);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    // Scenario 1 & 2: Work exists, so we always include work and category_id
    if (searchTerm) {
      params.set('work', searchTerm);
      params.set('category_id', selectedCategory);
    } else if (selectedCategory && selectedCategory !== 'all') {
      // Scenario 3: Only category_id
      params.set('category_id', selectedCategory);
    }
    // Scenario 4: No filters (params remains empty)

    handleProtectedLink(`/buscar?${params.toString()}`);
  };

  const handleCategoryClick = (categoryId: string | number) => {
    handleProtectedLink(`/buscar?category_id=${categoryId}`);
  };

  return (
    <div className="gradient-bg py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
          Encuentra el <span className="text-primary">experto perfecto</span><br />
          para tu hogar
        </h1>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          Conectamos a personas como tú con expertos calificados en reparaciones, 
          construcción y mejoras para el hogar. Rápido, confiable y profesional.
        </p>

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block text-left">
                ¿Qué necesitas?
              </label>
              <Input
                placeholder="Ej: Reparar grifo, instalar tomacorriente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block text-left">
                Especialidad
              </label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Todas las especialidades" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-border shadow-lg">
                  <SelectItem value="all">Todas</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block text-left">
                Buscar
              </label>
              <Button 
                onClick={handleSearch}
                className="w-full h-12 btn-primary"
              >
                <Search className="w-5 h-5 mr-2" />
                Buscar Expertos
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {categories.slice(0, 4).map((category) => (
            <Button
              key={category.id}
              variant="outline"
              onClick={() => handleCategoryClick(category.id)}
              className="h-16 bg-white/80 hover:bg-white border-border hover:border-primary transition-all"
            >
              <span className="text-sm font-medium">{category.name}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchHero;
