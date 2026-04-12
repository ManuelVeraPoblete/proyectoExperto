import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { expertos, portfolioItems } from '@/lib/mock-data';
import { PortfolioEntry, PortfolioReactions, PortfolioReview } from '@/types/experto';

type ReactionKey = keyof PortfolioReactions;

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

const buildPerfilFromMock = (id: string): PerfilPublicoData | null => {
  const raw = expertos.find((e) => e.id === id);
  if (!raw) return null;
  return {
    id: raw.id,
    nombres: raw.nombres,
    apellidos: raw.apellidos,
    avatar: raw.avatar,
    especialidades: raw.especialidades,
    calificacion: raw.rating,
    reviewCount: raw.reviews,
    comuna: raw.comuna,
    region: raw.region,
    descripcion: raw.descripcion,
    isVerified: true,
    experience: '10 años',
    hourlyRate: 15000,
    telefono: '+56 9 1234 5678',
  };
};

export const usePerfilPublicoExperto = (expertoId: string) => {
  const { user } = useAuth();

  const experto = buildPerfilFromMock(expertoId);

  const [portfolio, setPortfolio] = useState<PortfolioEntry[]>(() =>
    portfolioItems.filter((p) => p.expertoId === expertoId) as PortfolioEntry[],
  );

  const [myReactions, setMyReactions] = useState<Record<string, ReactionKey | null>>({});

  const toggleReaction = useCallback(
    (itemId: string, reaction: ReactionKey) => {
      setMyReactions((prev) => {
        const current = prev[itemId] ?? null;
        return { ...prev, [itemId]: current === reaction ? null : reaction };
      });

      setPortfolio((prev) =>
        prev.map((item) => {
          if (item.id !== itemId) return item;
          const current = myReactions[itemId] ?? null;
          const updated = { ...item.reactions };
          if (current) updated[current] = Math.max(0, updated[current] - 1);
          if (current !== reaction) updated[reaction] = updated[reaction] + 1;
          return { ...item, reactions: updated };
        }),
      );
    },
    [myReactions],
  );

  const addReview = useCallback(
    (itemId: string, comment: string, rating: number) => {
      if (!user) return;
      const newReview: PortfolioReview = {
        id: `rev_${Date.now()}`,
        user: `${user.nombres} ${user.apellidos}`,
        userId: user.id,
        comment,
        rating,
        date: new Date().toISOString().split('T')[0],
      };
      setPortfolio((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? { ...item, reviews: [...item.reviews, newReview] }
            : item,
        ),
      );
    },
    [user],
  );

  return {
    experto,
    portfolio,
    myReactions,
    toggleReaction,
    addReview,
    currentUserId: user?.id ?? null,
    isLoggedIn: !!user,
  };
};
