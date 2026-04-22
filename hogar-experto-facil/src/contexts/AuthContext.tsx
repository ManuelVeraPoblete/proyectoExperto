import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { normalizeUser, NormalizedUser } from '@/lib/userNormalizer';
import { storageService } from '@/services/storageService';
import { logger } from '@/lib/logger';

const isTokenExpired = (token?: string): boolean => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

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
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inactivityRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const INACTIVITY_LIMIT = 5 * 60 * 1000;

  const doLogout = (): void => {
    setUser(null);
    storageService.clearUser();
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (inactivityRef.current) clearTimeout(inactivityRef.current);
  };

  // Recuperar sesión al iniciar y validar token
  useEffect(() => {
    const savedUser = storageService.getUser();
    if (!savedUser) return;

    if (isTokenExpired(savedUser.token)) {
      logger.debug('Token expirado al iniciar — cerrando sesión');
      storageService.clearUser();
      return;
    }

    const normalized = normalizeUser(savedUser);
    if (normalized) {
      setUser(normalized);
      logger.debug('Sesión recuperada:', { id: normalized.id, rol: normalized.userType });
    } else {
      storageService.clearUser();
    }
  }, []);

  // Verificar expiración cada minuto mientras la app está abierta
  useEffect(() => {
    if (!user) return;

    intervalRef.current = setInterval(() => {
      const savedUser = storageService.getUser();
      if (isTokenExpired(savedUser?.token)) {
        logger.debug('Token expirado — cerrando sesión automáticamente');
        doLogout();
      }
    }, 60_000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [user]);

  // Cerrar sesión por inactividad (5 minutos sin interacción)
  useEffect(() => {
    if (!user) return;

    const resetTimer = () => {
      if (inactivityRef.current) clearTimeout(inactivityRef.current);
      inactivityRef.current = setTimeout(() => {
        logger.debug('Sesión cerrada por inactividad');
        doLogout();
      }, INACTIVITY_LIMIT);
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach(e => window.addEventListener(e, resetTimer));
    resetTimer();

    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimer));
      if (inactivityRef.current) clearTimeout(inactivityRef.current);
    };
  }, [user]);

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

  const logout = (): void => doLogout();

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
