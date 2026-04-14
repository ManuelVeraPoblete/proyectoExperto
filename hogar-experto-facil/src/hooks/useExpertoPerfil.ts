import { useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { portfolioService, PortfolioItem, CreatePortfolioData } from '@/services/api/portfolioService';
import { expertoService } from '@/services/api/expertoService';
import { trabajoService } from '@/services/api/trabajoService';
import { PortfolioEntry } from '@/types/experto';
import { Trabajo } from '@/types';
import { API_BASE_URL } from '@/lib/api-config';

// Base para archivos estáticos (sin /api)
const SERVER_URL = API_BASE_URL.replace(/\/api$/, '');

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

export interface ExpertoPerfilData {
  id: string;
  nombres: string;
  apellidos: string;
  avatar?: string;
  especialidades: string[];
  calificacion: number;
  reviewCount: number;
  comuna: string;
  region: string;
  experience: string;
  hourlyRate?: number;
  isVerified: boolean;
  telefono: string;
  direccion: string;
  descripcion: string;
}

export const useExpertoPerfil = () => {
  const { user, updateUser } = useAuth();
  const queryClient = useQueryClient();

  // ─── Portfolio ────────────────────────────────────────────────────────────────
  const { data: rawPortfolio = [], isLoading: isLoadingPortfolio } = useQuery({
    queryKey: ['portfolio', user?.id],
    queryFn: () => portfolioService.getByExpert(user!.id),
    enabled: !!user?.id,
  });

  const { data: rawCompletedJobs = [] } = useQuery({
    queryKey: ['completed-jobs-experto', user?.id],
    queryFn: () => trabajoService.getMisTrabajos({ expertoId: user!.id, estado: 'completado' }),
    enabled: !!user?.id,
  });

  const portfolioTitles = new Set(
    (rawPortfolio as PortfolioItem[]).map((p) => p.title.toLowerCase().trim())
  );

  const completedJobEntries: PortfolioEntry[] = (rawCompletedJobs as Trabajo[])
    .filter((j) => !portfolioTitles.has(j.titulo.toLowerCase().trim()))
    .map(trabajoToPortfolioEntry);

  const portfolio: PortfolioEntry[] = [
    ...(rawPortfolio as PortfolioItem[]).map(toPortfolioEntry),
    ...completedJobEntries,
  ].sort((a, b) => b.date.localeCompare(a.date));

  const addItemMutation = useMutation({
    mutationFn: (data: CreatePortfolioData) => portfolioService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio', user?.id] });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: (itemId: number) => portfolioService.remove(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio', user?.id] });
    },
  });

  const reactMutation = useMutation({
    mutationFn: ({ itemId, reaction }: { itemId: number; reaction: string }) =>
      portfolioService.react(itemId, reaction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio', user?.id] });
    },
  });

  // ─── Profile ──────────────────────────────────────────────────────────────────
  const saveProfileMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => expertoService.updateProfile(data),
    onSuccess: (updated) => {
      updateUser({
        nombres: (updated as any).User?.nombres,
        apellidos: (updated as any).User?.apellidos,
        telefono: (updated as any).User?.telefono,
        region: (updated as any).region,
        provincia: (updated as any).provincia,
        comuna: (updated as any).comuna,
      });
    },
  });

  // Build perfil from auth user
  const expertoPerfil: ExpertoPerfilData | null = user
    ? {
        id: user.id,
        nombres: user.nombres,
        apellidos: user.apellidos,
        avatar: user.avatar,
        especialidades: user.especialidades ?? [],
        calificacion: user.calificacion ?? 0,
        reviewCount: user.reviewCount ?? 0,
        comuna: user.comuna ?? '',
        region: user.region ?? '',
        experience: '',
        hourlyRate: user.hourlyRate,
        isVerified: user.isVerified ?? false,
        telefono: user.telefono ?? '',
        direccion: user.direccion ?? '',
        descripcion: '',
      }
    : null;

  const toggleReaction = useCallback(
    (itemId: string, reaction: string) => {
      if (itemId.startsWith('job-')) return;  // sin PortfolioItem real aún
      reactMutation.mutate({ itemId: Number(itemId), reaction });
    },
    [reactMutation],
  );

  const addPortfolioItem = useCallback(
    (data: CreatePortfolioData) => {
      addItemMutation.mutate(data);
    },
    [addItemMutation],
  );

  const removePortfolioItem = useCallback(
    (itemId: string) => {
      removeItemMutation.mutate(Number(itemId));
    },
    [removeItemMutation],
  );

  const savePerfilChanges = useCallback(
    (changes: Partial<ExpertoPerfilData>) => {
      const payload: Record<string, unknown> = {};
      if (changes.nombres)   payload.nombres   = changes.nombres;
      if (changes.apellidos) payload.apellidos = changes.apellidos;
      if (changes.telefono)  payload.telefono  = changes.telefono;
      if (changes.descripcion) payload.bio     = changes.descripcion;
      if (changes.region)    payload.region    = changes.region;
      if (changes.comuna)    payload.comuna    = changes.comuna;
      saveProfileMutation.mutate(payload);
    },
    [saveProfileMutation],
  );

  const myReactions = useMemo(() => {
    if (!user?.id) return {} as Record<string, string | null>;
    const map: Record<string, string | null> = {};
    (rawPortfolio as PortfolioItem[]).forEach((item) => {
      const mine = item.Reactions?.find((r) => r.userId === user.id);
      map[String(item.id)] = mine?.reaction ?? null;
    });
    return map;
  }, [rawPortfolio, user?.id]);

  return {
    expertoPerfil,
    portfolio,
    isLoadingPortfolio,
    myReactions,
    toggleReaction,
    addPortfolioItem,
    removePortfolioItem,
    savePerfilChanges,
    isSavingProfile: saveProfileMutation.isPending,
  };
};
