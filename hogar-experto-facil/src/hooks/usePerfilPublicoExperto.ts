import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { expertoService } from '@/services/api/expertoService';
import { portfolioService, PortfolioItem } from '@/services/api/portfolioService';
import { PortfolioEntry } from '@/types/experto';
import { mapApiExpertoToCardData, ApiExperto } from '@/lib/expertoMapper';
import { API_BASE_URL } from '@/lib/api-config';

const SERVER_URL = API_BASE_URL.replace(/\/api$/, '');

export interface PerfilPublicoData {
  id: string;
  nombres: string;
  apellidos: string;
  avatar?: string;
  especialidades: string[];
  calificacion: number;
  reviewCount: number;
  comuna: string;
  region: string;
  descripcion: string;
  isVerified: boolean;
  experience: string;
  hourlyRate?: number;
  telefono: string;
}

const parseImageUrls = (image_url?: string): string[] => {
  if (!image_url) return [];
  try {
    const paths: string[] = JSON.parse(image_url);
    return paths.map((p) => (p.startsWith('http') ? p : `${SERVER_URL}${p}`));
  } catch {
    return [];
  }
};

const toPortfolioEntry = (item: PortfolioItem): PortfolioEntry => ({
  id: String(item.id),
  title: item.title,
  description: item.description ?? '',
  category: item.category ?? '',
  date: item.date ?? item.createdAt.split('T')[0],
  images: parseImageUrls(item.image_url),
  reactions: {
    heart:   item.Reactions?.filter(r => r.reaction === 'heart').length ?? 0,
    like:    item.Reactions?.filter(r => r.reaction === 'like').length ?? 0,
    clap:    item.Reactions?.filter(r => r.reaction === 'clap').length ?? 0,
    dislike: item.Reactions?.filter(r => r.reaction === 'dislike').length ?? 0,
  },
  reviews: (item.Reviews ?? []).map(r => ({
    id: String(r.id),
    user: r.Reviewer ? `${r.Reviewer.nombres} ${r.Reviewer.apellidos}` : 'Usuario',
    userId: r.userId,
    comment: r.comment,
    rating: Number(r.rating),
    date: r.createdAt.split('T')[0],
  })),
});

export const usePerfilPublicoExperto = (expertoId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: rawExperto, isLoading: isLoadingExperto } = useQuery({
    queryKey: ['experto-publico', expertoId],
    queryFn: () => expertoService.getById(expertoId),
    enabled: !!expertoId,
  });

  const expertoData: PerfilPublicoData | null = rawExperto
    ? (() => {
        const card = mapApiExpertoToCardData(rawExperto as ApiExperto);
        return {
          id: card.id,
          nombres: card.nombres,
          apellidos: card.apellidos,
          avatar: card.avatar,
          especialidades: card.especialidades,
          calificacion: card.calificacion,
          reviewCount: card.reviewCount,
          comuna: card.comuna,
          region: card.region,
          descripcion: card.descripcion ?? '',
          isVerified: card.isVerified,
          experience: card.experience,
          hourlyRate: card.hourlyRate,
          telefono: card.telefono,
        };
      })()
    : null;

  const { data: rawPortfolio = [], isLoading: isLoadingPortfolio } = useQuery({
    queryKey: ['portfolio-publico', expertoId],
    queryFn: () => portfolioService.getByExpert(expertoId),
    enabled: !!expertoId,
  });

  const portfolio: PortfolioEntry[] = rawPortfolio.map(toPortfolioEntry);

  const reactMutation = useMutation({
    mutationFn: ({ itemId, reaction }: { itemId: number; reaction: string }) =>
      portfolioService.react(itemId, reaction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio-publico', expertoId] });
    },
  });

  const reviewMutation = useMutation({
    mutationFn: ({ itemId, comment, rating }: { itemId: number; comment: string; rating: number }) =>
      portfolioService.addReview(itemId, { comment, rating }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio-publico', expertoId] });
    },
  });

  const toggleReaction = useCallback(
    (itemId: string, reaction: string) => {
      if (!user) return;
      reactMutation.mutate({ itemId: Number(itemId), reaction });
    },
    [user, reactMutation],
  );

  const addReview = useCallback(
    (itemId: string, comment: string, rating: number) => {
      if (!user) return;
      reviewMutation.mutate({ itemId: Number(itemId), comment, rating });
    },
    [user, reviewMutation],
  );

  return {
    experto: expertoData,
    isLoadingExperto,
    portfolio,
    isLoadingPortfolio,
    myReactions: {} as Record<string, string | null>,
    toggleReaction,
    addReview,
    currentUserId: user?.id ?? null,
    isLoggedIn: !!user,
  };
};
