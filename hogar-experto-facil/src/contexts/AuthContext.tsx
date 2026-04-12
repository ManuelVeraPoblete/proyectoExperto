import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { normalizeUser, NormalizedUser } from '@/lib/userNormalizer';
import { storageService } from '@/services/storageService';
import { logger } from '@/lib/logger';

// ─── Tipos ────────────────────────────────────────────────────────────────────
export type User = NormalizedUser;

interface AuthDialogState {
  isOpen: boolean;
  mode: 'login' | 'register';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: unknown) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  authDialog: AuthDialogState;
  openAuthDialog: (mode: 'login' | 'register') => void;
  closeAuthDialog: () => void;
  setAuthDialogMode: (mode: 'login' | 'register') => void;
}

// ─── Contexto ─────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// ─── Provider ─────────────────────────────────────────────────────────────────
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [authDialog, setAuthDialog] = useState<AuthDialogState>({
    isOpen: false,
    mode: 'login',
  });

  // Recuperar sesión al iniciar
  useEffect(() => {
    const savedUser = storageService.getUser();
    if (!savedUser) return;

    const normalized = normalizeUser(savedUser);
    if (normalized) {
      setUser(normalized);
      logger.debug('Sesión recuperada:', { id: normalized.id, rol: normalized.userType });
    } else {
      storageService.clearUser();
    }
  }, []);

  // ─── Acciones ───────────────────────────────────────────────────────────────
  const login = (userData: unknown): void => {
    storageService.clearUser();
    const normalized = normalizeUser(userData);
    if (normalized) {
      setUser(normalized);
      storageService.setUser(normalized);
      logger.debug('Login exitoso:', { id: normalized.id, rol: normalized.userType });
    }
  };

  const logout = (): void => {
    setUser(null);
    storageService.clearUser();
  };

  const updateUser = (userData: Partial<User>): void => {
    if (!user) return;
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    storageService.setUser(updatedUser);
  };

  const openAuthDialog = (mode: 'login' | 'register'): void => {
    setAuthDialog({ isOpen: true, mode });
  };

  const closeAuthDialog = (): void => {
    setAuthDialog({ isOpen: false, mode: 'login' });
  };

  const setAuthDialogMode = (mode: 'login' | 'register'): void => {
    setAuthDialog(prev => ({ ...prev, mode }));
  };

  // ─── Valor del contexto ──────────────────────────────────────────────────────
  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    updateUser,
    authDialog,
    openAuthDialog,
    closeAuthDialog,
    setAuthDialogMode,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
