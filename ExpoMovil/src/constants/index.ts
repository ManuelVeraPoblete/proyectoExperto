// ─── Roles de usuario ────────────────────────────────────────────────────────
export const ROLES = {
  CLIENT: 'client',
  EXPERTO: 'experto',
  ADMIN: 'admin',
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

// ─── Nombres de pantallas (navegación) ──────────────────────────────────────
export const SCREENS = {
  // Auth
  LOGIN: 'Login',
  REGISTER: 'Register',
  // Client
  CLIENT_TABS: 'ClientTabs',
  CLIENT_DASHBOARD: 'ClientDashboard',
  CLIENT_BUSCAR: 'BuscarExpertos',
  CLIENT_PUBLICAR: 'PublicarTrabajo',
  CLIENT_MIS_TRABAJOS: 'MisTrabajosCliente',
  CLIENT_MENSAJES: 'MensajesCliente',
  // Experto
  EXPERTO_TABS: 'ExpertoTabs',
  EXPERTO_DASHBOARD: 'ExpertoDashboard',
  EXPERTO_BUSCAR: 'BuscarTrabajos',
  EXPERTO_MIS_TRABAJOS: 'MisTrabajosExperto',
  EXPERTO_MENSAJES: 'MensajesExperto',
  EXPERTO_PERFIL: 'PerfilExperto',
  // Shared
  PERFIL_PUBLICO: 'PerfilPublicoExperto',
  CHAT: 'Chat',
} as const;

// ─── Estados de trabajos ─────────────────────────────────────────────────────
export const JOB_STATUS = {
  NEW: 'new',
  APPLIED: 'applied',
  ACCEPTED: 'accepted',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  PENDING: 'pending',
  CANCELLED: 'cancelled',
} as const;

export type JobStatus = (typeof JOB_STATUS)[keyof typeof JOB_STATUS];

export interface StatusConfig {
  label: string;
  color: string;
  bg: string;
}

export const JOB_STATUS_CONFIG: Record<string, StatusConfig> = {
  [JOB_STATUS.NEW]:         { label: 'Nuevo',       color: '#2563EB', bg: '#EFF6FF' },
  [JOB_STATUS.APPLIED]:     { label: 'Aplicado',    color: '#D97706', bg: '#FFFBEB' },
  [JOB_STATUS.ACCEPTED]:    { label: 'Aceptado',    color: '#16A34A', bg: '#F0FDF4' },
  [JOB_STATUS.IN_PROGRESS]: { label: 'En Progreso', color: '#7C3AED', bg: '#F5F3FF' },
  [JOB_STATUS.COMPLETED]:   { label: 'Completado',  color: '#16A34A', bg: '#F0FDF4' },
  [JOB_STATUS.PENDING]:     { label: 'Pendiente',   color: '#CA8A04', bg: '#FEFCE8' },
  [JOB_STATUS.CANCELLED]:   { label: 'Cancelado',   color: '#DC2626', bg: '#FEF2F2' },
  // Backend values (Spanish)
  activo:      { label: 'Activo',       color: '#2563EB', bg: '#EFF6FF' },
  en_proceso:  { label: 'En Progreso',  color: '#7C3AED', bg: '#F5F3FF' },
  completado:  { label: 'Completado',   color: '#16A34A', bg: '#F0FDF4' },
  cancelado:   { label: 'Cancelado',    color: '#DC2626', bg: '#FEF2F2' },
};

// ─── Claves de almacenamiento ────────────────────────────────────────────────
export const STORAGE_KEYS = {
  USER: 'hogar_experto_user',
} as const;

// ─── Paginación ──────────────────────────────────────────────────────────────
export const ITEMS_PER_PAGE = 10;

// ─── Filtros de calificación ─────────────────────────────────────────────────
export const RATING_FILTERS = ['4.5+', '4.0+', '3.5+', 'Todos'] as const;
export type RatingFilter = (typeof RATING_FILTERS)[number];

// ─── Colores del tema ─────────────────────────────────────────────────────────
export const COLORS = {
  primary: '#F97316',
  primaryDark: '#EA580C',
  secondary: '#1E3A5F',
  background: '#F9FAFB',
  surface: '#FFFFFF',
  text: '#111827',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  error: '#DC2626',
  success: '#16A34A',
  warning: '#D97706',
} as const;
