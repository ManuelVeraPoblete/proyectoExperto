import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { expertoService } from '@/services/api/expertoService';
import { categoriaService, CategoriaOption } from '@/services/api/categoriaService';
import { mapApiExpertoToCardData } from '@/lib/expertoMapper';
import { logger } from '@/lib/logger';
import { ITEMS_PER_PAGE, RATING_FILTERS, RatingFilter } from '@/constants';
import { Message } from '@/types';
import { ExpertoCardData } from '@/types/experto';
import type { ExpertoBusquedaParams } from '@/services/api/expertoService';

// ─── Tipos exportados ─────────────────────────────────────────────────────────
export interface BuscarExpertosState {
  searchTerm: string;
  selectedCategory: string;
  selectedRating: RatingFilter | '';
  expertos: ExpertoCardData[];
  categories: CategoriaOption[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  paginatedExpertos: ExpertoCardData[];
  isChatOpen: boolean;
  chatParticipantName: string;
  chatMessages: Message[];
  ratings: typeof RATING_FILTERS;
}

export interface BuscarExpertosActions {
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (cat: string) => void;
  setSelectedRating: (rating: RatingFilter | '') => void;
  handleSearch: () => void;
  handlePageChange: (page: number) => void;
  handleContactExperto: (expertoId: string, expertoName: string) => void;
  handleSendMessage: (message: string) => void;
  handleCloseChat: () => void;
  clearFilters: () => void;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useBuscarExpertos = (): BuscarExpertosState & BuscarExpertosActions => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Filtros
  const [searchTerm, setSearchTerm] = useState(searchParams.get('work') ?? '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category_id') ?? 'all');
  const [selectedRating, setSelectedRating] = useState<RatingFilter | ''>('');

  // Datos
  const [expertos, setExpertos] = useState<ExpertoCardData[]>([]);
  const [categories, setCategories] = useState<CategoriaOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);

  // Chat
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatParticipantName, setChatParticipantName] = useState('');
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  // Cargar categorías al montar
  useEffect(() => {
    categoriaService.getAllFormatted()
      .then(setCategories)
      .catch(err => logger.error('Error cargando categorías:', err));
  }, []);

  // ─── Fetch de expertos ───────────────────────────────────────────────────────
  const fetchExpertos = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: ExpertoBusquedaParams = {};

      if (searchTerm) {
        params.work = searchTerm;
        params.category_id = selectedCategory;
      } else if (selectedCategory && selectedCategory !== 'all') {
        params.category_id = selectedCategory;
      }

      if (selectedRating && selectedRating !== 'Todos') {
        params.rating = selectedRating.replace('+', '');
      }

      if (user?.region)    params.region    = user.region;
      if (user?.provincia) params.provincia  = user.provincia;
      if (user?.comuna)    params.comuna     = user.comuna;

      const data = await expertoService.search(params);
      setExpertos(data.map(mapApiExpertoToCardData));
      setCurrentPage(1);
    } catch (err) {
      logger.error('Error buscando expertos:', err);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los expertos. Inténtalo más tarde.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, selectedCategory, selectedRating, user?.region, user?.provincia, user?.comuna, toast]);

  useEffect(() => {
    fetchExpertos();
  }, [fetchExpertos]);

  // ─── Paginación ──────────────────────────────────────────────────────────────
  const totalPages = Math.ceil(expertos.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedExpertos = expertos.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // ─── Acciones ────────────────────────────────────────────────────────────────
  const handleSearch = useCallback((): void => {
    fetchExpertos();
  }, [fetchExpertos]);

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContactExperto = (expertoId: string, expertoName: string): void => {
    logger.debug('Iniciando chat con:', expertoId);
    setChatMessages([{
      id: 'initial',
      sender: 'other',
      text: `Hola, soy ${expertoName}. ¿En qué puedo ayudarte?`,
      timestamp: new Date().toISOString(),
      read: true,
    }]);
    setChatParticipantName(expertoName);
    setIsChatOpen(true);
  };

  const handleSendMessage = (message: string): void => {
    setChatMessages(prev => [...prev, {
      id: Date.now().toString(),
      sender: 'me',
      text: message,
      timestamp: new Date().toISOString(),
      read: true,
    }]);
    toast({
      title: 'Mensaje Enviado',
      description: `Tu mensaje a ${chatParticipantName} ha sido enviado.`,
    });
  };

  const clearFilters = (): void => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedRating('');
  };

  return {
    // State
    searchTerm,
    selectedCategory,
    selectedRating,
    expertos,
    categories,
    isLoading,
    currentPage,
    totalPages,
    paginatedExpertos,
    isChatOpen,
    chatParticipantName,
    chatMessages,
    ratings: RATING_FILTERS,
    // Actions
    setSearchTerm,
    setSelectedCategory,
    setSelectedRating,
    handleSearch,
    handlePageChange,
    handleContactExperto,
    handleSendMessage,
    handleCloseChat: () => setIsChatOpen(false),
    clearFilters,
  };
};
