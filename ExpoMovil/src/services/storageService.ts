import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/constants';
import { NormalizedUser } from '@/lib/userNormalizer';

export const storageService = {
  getUser: async (): Promise<NormalizedUser | null> => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return raw ? (JSON.parse(raw) as NormalizedUser) : null;
    } catch {
      return null;
    }
  },

  setUser: async (user: NormalizedUser): Promise<void> => {
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  clearUser: async (): Promise<void> => {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
  },
};
