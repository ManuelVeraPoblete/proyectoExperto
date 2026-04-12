import { apiClient } from '@/lib/apiClient';

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface CategoriaRaw {
  id: number;
  nombre?: string;
  name?: string;
}

export interface CategoriaOption {
  id: number | string;
  name: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatCategoria = (cat: CategoriaRaw): CategoriaOption => ({
  id: cat.id,
  name: cat.nombre ?? cat.name ?? '',
});

const isValidCategoria = (cat: CategoriaOption): boolean =>
  Boolean(cat.name && cat.id);

// ─── Servicio ─────────────────────────────────────────────────────────────────
export const categoriaService = {
  getAll: (): Promise<CategoriaRaw[]> =>
    apiClient.get<CategoriaRaw[]>('/categories'),

  getAllFormatted: async (): Promise<CategoriaOption[]> => {
    const data = await apiClient.get<CategoriaRaw[]>('/categories');
    return data.map(formatCategoria).filter(isValidCategoria);
  },
};
