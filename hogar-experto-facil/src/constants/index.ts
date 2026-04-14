// ─── Roles de usuario ────────────────────────────────────────────────────────
export const ROLES = {
  CLIENT: 'client',
  EXPERTO: 'experto',
  ADMIN: 'admin',
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

// ─── Rutas de la aplicación ──────────────────────────────────────────────────
export const ROUTES = {
  HOME: '/',
  BUSCAR: '/buscar',
  PUBLICAR: '/publicar',
  DASHBOARD: '/dashboard',
  REGISTER: '/register',
  MENSAJES: '/mensajes',
  EXPERTO_BUSCAR: '/experto/buscar-trabajos',
  EXPERTO_TRABAJOS: '/experto/mis-trabajos',
  EXPERTO_MENSAJES: '/experto/mensajes',
  EXPERTO_PERFIL: '/experto/perfil',
  EXPERTO_PERFIL_PUBLICO: '/experto/:id',
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
  colorClass: string;
}

export const JOB_STATUS_CONFIG: Record<string, StatusConfig> = {
  // Valores del frontend
  [JOB_STATUS.NEW]:         { label: 'Nuevo',       colorClass: 'text-blue-600 bg-blue-50'    },
  [JOB_STATUS.APPLIED]:     { label: 'Aplicado',    colorClass: 'text-orange-600 bg-orange-50' },
  [JOB_STATUS.ACCEPTED]:    { label: 'Aceptado',    colorClass: 'text-green-600 bg-green-50'   },
  [JOB_STATUS.IN_PROGRESS]: { label: 'En Progreso', colorClass: 'text-purple-600 bg-purple-50' },
  [JOB_STATUS.COMPLETED]:   { label: 'Completado',  colorClass: 'text-green-600 bg-green-50'   },
  [JOB_STATUS.PENDING]:     { label: 'Pendiente',   colorClass: 'text-yellow-600 bg-yellow-50' },
  [JOB_STATUS.CANCELLED]:   { label: 'Cancelado',   colorClass: 'text-red-600 bg-red-50'       },
  // Valores del backend (español)
  activo:      { label: 'Activo',       colorClass: 'text-blue-600 bg-blue-50'    },
  en_proceso:  { label: 'En Progreso',  colorClass: 'text-purple-600 bg-purple-50' },
  completado:  { label: 'Completado',   colorClass: 'text-green-600 bg-green-50'   },
  cancelado:   { label: 'Cancelado',    colorClass: 'text-red-600 bg-red-50'       },
};

// ─── Claves de localStorage ──────────────────────────────────────────────────
export const STORAGE_KEYS = {
  USER: 'hogar_experto_user',
} as const;

// ─── Paginación ──────────────────────────────────────────────────────────────
export const ITEMS_PER_PAGE = 9;

// ─── Filtros de calificación ─────────────────────────────────────────────────
export const RATING_FILTERS = ['4.5+', '4.0+', '3.5+', 'Todos'] as const;
export type RatingFilter = (typeof RATING_FILTERS)[number];
