import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { portfolioService, PortfolioItem } from '@/services/api/portfolioService';
import { expertoService } from '@/services/api/expertoService';
import { PortfolioEntry } from '@/types/experto';

const toPortfolioEntry = (item: PortfolioItem): PortfolioEntry => ({
  id: String(item.id),
  title: item.title,
  description: item.description ?? '',
  category: item.category ?? '',
  date: item.date ?? item.createdAt.split('T')[0],
  image: item.image_url || undefined,
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

  const portfolio: PortfolioEntry[] = rawPortfolio.map(toPortfolioEntry);

  const addItemMutation = useMutation({
    mutationFn: (data: { title: string; description?: string; category?: string; image_url?: string; date?: string }) =>
      portfolioService.create(data),
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
      reactMutation.mutate({ itemId: Number(itemId), reaction });
    },
    [reactMutation],
  );

  const addPortfolioItem = useCallback(
    (data: { title: string; description?: string; category?: string; image?: string; image_url?: string; date?: string }) => {
      addItemMutation.mutate({ ...data, image_url: data.image_url ?? data.image });
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

  return {
    expertoPerfil,
    portfolio,
    isLoadingPortfolio,
    myReactions: {} as Record<string, string | null>,
    toggleReaction,
    addPortfolioItem,
    removePortfolioItem,
    savePerfilChanges,
    isSavingProfile: saveProfileMutation.isPending,
  };
};
