import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { chileData } from '@/lib/chile-data';
import { Trabajo } from '@/types';
import { trabajoService } from '@/services/api/trabajoService';
import { categoriaService, CategoriaOption } from '@/services/api/categoriaService';
import { logger } from '@/lib/logger';

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface UseJobSearchProps {
  initialSearchTerm?: string;
  initialCategory?: string;
  initialRegion?: string;
  initialProvincia?: string;
  initialComuna?: string;
  expertSpecialties?: Array<string | number>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
const useJobSearch = ({
  initialSearchTerm = '',
  initialCategory = '',
  initialRegion = '',
  initialProvincia = '',
  initialComuna = '',
  expertSpecialties = [],
}: UseJobSearchProps) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedRegion, setSelectedRegion] = useState(initialRegion);
  const [selectedProvincia, setSelectedProvincia] = useState(initialProvincia);
  const [selectedComuna, setSelectedComuna] = useState(initialComuna);
  const [filteredJobs, setFilteredJobs] = useState<Trabajo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<CategoriaOption[]>([]);

  // Estabilizar especialidades para evitar bucles con referencias de array nuevas
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedSpecialties = useMemo(() => expertSpecialties ?? [], [JSON.stringify(expertSpecialties)]);

  const isFirstRender = useRef(true);

  // Cargar categorías una vez al montar
  useEffect(() => {
    categoriaService.getAllFormatted()
      .then(setCategories)
      .catch(err => logger.error('Error cargando categorías:', err));
  }, []);

  const buildParams = useCallback((): Parameters<typeof trabajoService.search>[0] => {
    const params: Parameters<typeof trabajoService.search>[0] = {};

    if (searchTerm.trim()) params.descripcion = searchTerm.trim();

    if (selectedCategory && selectedCategory !== 'all') {
      params.categoryId = selectedCategory;
    } else if (
      isFirstRender.current &&
      memoizedSpecialties.length > 0 &&
      !searchTerm &&
      (!selectedCategory || selectedCategory === 'all')
    ) {
      params.categoryId = memoizedSpecialties.map(String);
    }

    if (selectedRegion)   params.region    = selectedRegion;
    if (selectedProvincia) params.provincia = selectedProvincia;
    if (selectedComuna && selectedComuna !== 'all') params.comuna = selectedComuna;

    return params;
  }, [searchTerm, selectedCategory, selectedRegion, selectedProvincia, selectedComuna, memoizedSpecialties]);

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = buildParams();
      logger.debug('Buscando trabajos:', params);
      const data = await trabajoService.search(params);
      setFilteredJobs(data.filter((j: Trabajo) => j.estado === 'activo'));
    } catch (err) {
      logger.error('Error buscando trabajos:', err);
    } finally {
      setIsLoading(false);
      isFirstRender.current = false;
    }
  }, [buildParams]);

  // Auto-búsqueda con debounce cuando cambian los filtros
  useEffect(() => {
    if (!isFirstRender.current && !selectedRegion && !searchTerm && !selectedCategory) return;
    const timer = setTimeout(fetchJobs, 500);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedCategory, selectedRegion, selectedProvincia, selectedComuna]);

  const handleRegionChange = (region: string): void => {
    setSelectedRegion(region);
    setSelectedProvincia('');
    setSelectedComuna('');
  };

  const handleProvinciaChange = (provincia: string): void => {
    setSelectedProvincia(provincia);
    setSelectedComuna('');
  };

  const provincias = selectedRegion
    ? chileData.find(r => r.region === selectedRegion)?.provincias
    : [];
  const comunasList = selectedProvincia
    ? provincias?.find(p => p.nombre === selectedProvincia)?.comunas
    : [];

  return {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedRegion,
    handleRegionChange,
    selectedProvincia,
    handleProvinciaChange,
    selectedComuna,
    setSelectedComuna,
    filteredJobs,
    categories,
    provincias,
    comunas: comunasList,
    isLoading,
    refreshJobs: fetchJobs,
  };
};

export default useJobSearch;
