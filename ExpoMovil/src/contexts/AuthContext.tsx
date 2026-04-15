import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { normalizeUser, NormalizedUser } from '@/lib/userNormalizer';
import { storageService } from '@/services/storageService';
import { logger } from '@/lib/logger';

export type User = NormalizedUser;

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: unknown) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Recuperar sesión al iniciar
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const savedUser = await storageService.getUser();
        if (!savedUser) return;
        const normalized = normalizeUser(savedUser);
        if (normalized) {
          setUser(normalized);
          logger.debug('Sesión recuperada:', { id: normalized.id, rol: normalized.userType });
        } else {
          await storageService.clearUser();
        }
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = async (userData: unknown): Promise<void> => {
    await storageService.clearUser();
    const normalized = normalizeUser(userData);
    if (normalized) {
      setUser(normalized);
      await storageService.setUser(normalized);
      logger.debug('Login exitoso:', { id: normalized.id, rol: normalized.userType });
    }
  };

  const logout = async (): Promise<void> => {
    setUser(null);
    await storageService.clearUser();
  };

  const updateUser = async (userData: Partial<User>): Promise<void> => {
    if (!user) return;
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    await storageService.setUser(updatedUser);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
