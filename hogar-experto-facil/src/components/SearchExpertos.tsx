
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '@/lib/api-config';

const SearchExpertos = () => {
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
  const navigate = useNavigate();

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
    
    navigate(`/buscar?${params.toString()}`);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Buscar Expertos</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground block">
            ¿Qué necesitas?
          </label>
          <Input
            placeholder="Ej: Reparar grifo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground block">
            Especialidad
          </label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Todas las especialidades" />
            </SelectTrigger>
            <SelectContent className="shadow-lg">
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
          <label className="text-sm font-medium text-foreground block md:invisible">
            Buscar
          </label>
          <Button 
            onClick={handleSearch}
            className="w-full btn-primary"
          >
            <Search className="w-4 h-4 mr-2" />
            Buscar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchExpertos;
