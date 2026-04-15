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
  avatar?: string;
  telefono: string;
  direccion: string;
  descripcion?: string;
}

export interface Review {
  user: string;
  rating: number;
  comment: string;
}

export interface PortfolioItem {
  title: string;
  description: string;
  images?: string[];
}

export interface PortfolioReactions {
  heart: number;
  like: number;
  clap: number;
  dislike: number;
}

export interface PortfolioReview {
  id: string;
  user: string;
  userId: string;
  comment: string;
  rating: number;
  date: string;
}

export interface PortfolioEntry {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  images?: string[];
  reactions: PortfolioReactions;
  reviews: PortfolioReview[];
}

/** @deprecated Usar PortfolioItem */
export type CompletedJob = PortfolioItem;

export interface ExpertoDetailed extends ExpertoBase {
  reviews: Review[];
  completedJobs: PortfolioItem[];
}

export interface ExpertoCardData extends ExpertoDetailed {
  unreadCount?: number;
}
