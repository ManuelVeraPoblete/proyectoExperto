import { STORAGE_KEYS } from '@/constants';
import { NormalizedUser } from '@/lib/userNormalizer';

/**
 * Abstracción sobre localStorage para el usuario autenticado.
 * Centraliza el manejo de errores de serialización.
 */
export const storageService = {
  getUser: (): NormalizedUser | null => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.USER);
      return raw ? (JSON.parse(raw) as NormalizedUser) : null;
    } catch {
      return null;
    }
  },

  setUser: (user: NormalizedUser): void => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  clearUser: (): void => {
    localStorage.removeItem(STORAGE_KEYS.USER);
  },
};
