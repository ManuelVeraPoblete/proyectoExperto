import React from 'react';
import { Search, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CategoriaOption } from '@/services/api/categoriaService';
import { RATING_FILTERS, RatingFilter } from '@/constants';

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface ExpertosFiltersProps {
  searchTerm: string;
  selectedCategory: string;
  selectedRating: RatingFilter | '';
  categories: CategoriaOption[];
  onSearchTermChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onRatingChange: (value: RatingFilter | '') => void;
  onSearch: () => void;
}

// ─── Componente ───────────────────────────────────────────────────────────────
const ExpertosFilters: React.FC<ExpertosFiltersProps> = ({
  searchTerm,
  selectedCategory,
  selectedRating,
  categories,
  onSearchTermChange,
  onCategoryChange,
  onRatingChange,
  onSearch,
}) => (
  <div className="bg-card rounded-lg border border-border p-6 mb-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">

      {/* Búsqueda por texto */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Buscar</label>
        <Input
          placeholder="Nombre o especialidad..."
          value={searchTerm}
          onChange={e => onSearchTermChange(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onSearch()}
        />
      </div>

      {/* Filtro por especialidad */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Especialidad</label>
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Todas las especialidades" />
          </SelectTrigger>
          <SelectContent className="shadow-lg">
            <SelectItem value="all">Todas</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat.id} value={String(cat.id)}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filtro por calificación */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Calificación</label>
        <Select
          value={selectedRating}
          onValueChange={v => onRatingChange(v as RatingFilter | '')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todas las calificaciones" />
          </SelectTrigger>
          <SelectContent className="shadow-lg">
            {RATING_FILTERS.map(rating => (
              <SelectItem key={rating} value={rating}>
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                  {rating}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>

    <div className="mt-4 flex justify-end">
      <Button className="btn-primary" onClick={onSearch}>
        <Search className="w-4 h-4 mr-2" />
        Buscar
      </Button>
    </div>
  </div>
);

export default ExpertosFilters;
