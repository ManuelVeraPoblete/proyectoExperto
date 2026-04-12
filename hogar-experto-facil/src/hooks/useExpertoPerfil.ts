import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { portfolioItems as mockPortfolioItems } from '@/lib/mock-data';
import { PortfolioEntry, PortfolioReactions } from '@/types/experto';

type ReactionKey = keyof PortfolioReactions;

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

// Simula el perfil completo del experto logueado con datos mock
const buildMockExpertoPerfil = (userId: string): ExpertoPerfilData => ({
  id: userId,
  nombres: 'Juan',
  apellidos: 'Pérez',
  avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  especialidades: ['Plomería', 'Gas'],
  calificacion: 4.9,
  reviewCount: 120,
  comuna: 'Santiago',
  region: 'Región Metropolitana',
  experience: '10 años',
  hourlyRate: 15000,
  isVerified: true,
  telefono: '+56 9 1234 5678',
  direccion: 'Av. Libertador 450, Santiago',
  descripcion:
    'Plomero certificado con más de 10 años de experiencia en instalaciones residenciales y comerciales. Especializado en reparación de fugas, instalación de calefont y remodelaciones de baño.',
});

export const useExpertoPerfil = () => {
  const { user, updateUser } = useAuth();

  const [portfolio, setPortfolio] = useState<PortfolioEntry[]>(() =>
    mockPortfolioItems.filter((p) => p.expertoId === 'm1') as PortfolioEntry[],
  );

  // Reacciones seleccionadas por el usuario actual (por ítem)
  const [myReactions, setMyReactions] = useState<Record<string, ReactionKey | null>>({});

  const expertoPerfil: ExpertoPerfilData | null = user
    ? {
        ...buildMockExpertoPerfil(user.id),
        nombres: user.nombres,
        apellidos: user.apellidos,
        avatar: user.avatar,
      }
    : null;

  // ─── Reacciones ───────────────────────────────────────────────────────────────
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

  // ─── Portafolio ───────────────────────────────────────────────────────────────
  const addPortfolioItem = useCallback(
    (data: Omit<PortfolioEntry, 'id' | 'reactions' | 'reviews'>) => {
      const newItem: PortfolioEntry = {
        ...data,
        id: `pi_${Date.now()}`,
        reactions: { heart: 0, like: 0, clap: 0, dislike: 0 },
        reviews: [],
      };
      setPortfolio((prev) => [newItem, ...prev]);
    },
    [],
  );

  const removePortfolioItem = useCallback((itemId: string) => {
    setPortfolio((prev) => prev.filter((p) => p.id !== itemId));
  }, []);

  // ─── Edición de perfil ────────────────────────────────────────────────────────
  const savePerfilChanges = useCallback(
    (changes: Partial<ExpertoPerfilData>) => {
      updateUser({
        nombres: changes.nombres,
        apellidos: changes.apellidos,
        telefono: changes.telefono,
        direccion: changes.direccion,
        region: changes.region,
        comuna: changes.comuna,
      });
    },
    [updateUser],
  );

  return {
    expertoPerfil,
    portfolio,
    myReactions,
    toggleReaction,
    addPortfolioItem,
    removePortfolioItem,
    savePerfilChanges,
  };
};
