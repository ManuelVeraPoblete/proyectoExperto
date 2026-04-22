import { useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { expertoService } from '@/services/api/expertoService';
import { portfolioService, PortfolioItem } from '@/services/api/portfolioService';
import { trabajoService } from '@/services/api/trabajoService';
import { PortfolioEntry, PortfolioReactions } from '@/types/experto';
import { Trabajo } from '@/types';
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

/** Convierte un trabajo completado en una entrada de portafolio para mostrarlo en el perfil */
const trabajoToPortfolioEntry = (job: Trabajo): PortfolioEntry => ({
  id: `job-${job.id}`,
  title: job.titulo,
  description: job.descripcion ?? '',
  category: typeof job.categoria === 'string' ? job.categoria : '',
  date: (job.createdAt ?? job.fechaCreacion).split('T')[0],
  images: (job.Fotos ?? []).map(f =>
    f.photo_url.startsWith('http') ? f.photo_url : `${SERVER_URL}${f.photo_url}`
  ),
  reactions: { heart: 0, like: 0, clap: 0, dislike: 0 },
  reviews: job.calificacion
    ? [{
        id: `job-review-${job.id}`,
        user: job.cliente_nombres
          ? `${job.cliente_nombres} ${job.cliente_apellidos ?? ''}`.trim()
          : 'Cliente',
        userId: job.clientId ?? '',
        comment: job.resena ?? '',
        rating: Number(job.calificacion),
        date: (job.createdAt ?? job.fechaCreacion).split('T')[0],
      }]
    : [],
});

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

  const { data: rawCompletedJobs = [] } = useQuery({
    queryKey: ['completed-jobs-experto', expertoId],
    queryFn: () => trabajoService.getMisTrabajos({ expertoId, estado: 'completado' }),
    enabled: !!expertoId,
  });

  // IDs de trabajos que ya tienen entrada manual en el portafolio (evitar duplicados por título)
  const portfolioTitles = new Set(rawPortfolio.map((p: PortfolioItem) => p.title.toLowerCase().trim()));

  const completedJobEntries: PortfolioEntry[] = (rawCompletedJobs as Trabajo[])
    .filter((j) => !portfolioTitles.has(j.titulo.toLowerCase().trim()))
    .map(trabajoToPortfolioEntry);

  // Portafolio manual + trabajos completados, ordenados por fecha descendente
  const portfolio: PortfolioEntry[] = [
    ...rawPortfolio.map(toPortfolioEntry),
    ...completedJobEntries,
  ].sort((a, b) => b.date.localeCompare(a.date));

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
      if (!user || itemId.startsWith('job-')) return;
      reactMutation.mutate({ itemId: Number(itemId), reaction });
    },
    [user, reactMutation],
  );

  const addReview = useCallback(
    (itemId: string, comment: string, rating: number) => {
      if (!user || itemId.startsWith('job-')) return;
      reviewMutation.mutate({ itemId: Number(itemId), comment, rating });
    },
    [user, reviewMutation],
  );

  // Nota: entradas con id 'job-*' son trabajos completados aún sin PortfolioItem creado.
  // A partir de ahora closeJob crea el PortfolioItem automáticamente, por lo que esas
  // entradas desaparecerán del listado virtual y aparecerán como ítems reales.

  const myReactions = useMemo(() => {
    if (!user?.id) return {} as Record<string, keyof PortfolioReactions | null>;
    const map: Record<string, keyof PortfolioReactions | null> = {};
    (rawPortfolio as PortfolioItem[]).forEach((item) => {
      const mine = item.Reactions?.find((r) => r.userId === user.id);
      map[String(item.id)] = (mine?.reaction as keyof PortfolioReactions) ?? null;
    });
    return map;
  }, [rawPortfolio, user?.id]);

  return {
    experto: expertoData,
    isLoadingExperto,
    portfolio,
    isLoadingPortfolio,
    myReactions,
    toggleReaction,
    addReview,
    currentUserId: user?.id ?? null,
    isLoggedIn: !!user,
  };
};
