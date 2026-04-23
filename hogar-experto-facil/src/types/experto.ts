import { ExpertoVerificationStatus, EXPERTO_STATUS } from '@/constants';

// ─── Tipos del dominio Experto ────────────────────────────────────────────────

export interface ExpertoBase {
  id: string;
  nombres: string;
  apellidos: string;
  especialidades: string[];
  calificacion: number;
  reviewCount: number;
  comuna: string;
  region: string;
  experience: string;
  hourlyRate?: number;
  isVerified: boolean;
  /** Estado de verificación asignado por el administrador */
  verificationStatus: ExpertoVerificationStatus;
  avatar?: string;
  telefono: string;
  direccion: string;
  descripcion?: string;
}

export { EXPERTO_STATUS };

export interface Review {
  user: string;
  rating: number;
  comment: string;
}

/** Ítem del portafolio de trabajos completados de un experto (tipo base / API) */
export interface PortfolioItem {
  title: string;
  description: string;
  images?: string[];
}

// ─── Portafolio enriquecido (UI) ─────────────────────────────────────────────

/** Reacciones de un ítem de portafolio */
export interface PortfolioReactions {
  heart: number;
  like: number;
  clap: number;
  dislike: number;
}

/** Reseña de un cliente sobre un ítem de portafolio */
export interface PortfolioReview {
  id: string;
  user: string;
  userId: string;
  comment: string;
  rating: number;
  date: string;
}

/** Ítem enriquecido del portafolio (para la página de perfil del experto) */
export interface PortfolioEntry {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  /** URLs absolutas de las fotos del trabajo (hasta 3) */
  images?: string[];
  reactions: PortfolioReactions;
  reviews: PortfolioReview[];
}

/** @deprecated Usar PortfolioItem. Mantenido por compatibilidad temporal. */
export type CompletedJob = PortfolioItem;

export interface ExpertoDetailed extends ExpertoBase {
  reviews: Review[];
  completedJobs: PortfolioItem[];
}

export interface ExpertoCardData extends ExpertoDetailed {
  unreadCount?: number;
}

// ─── Aliases de compatibilidad (deprecados) ───────────────────────────────────
/** @deprecated Usar ExpertoBase */
export type MaestroBase = ExpertoBase;
/** @deprecated Usar ExpertoDetailed */
export type MaestroDetailed = ExpertoDetailed;
/** @deprecated Usar ExpertoCardData */
export type MaestroCardData = ExpertoCardData;
