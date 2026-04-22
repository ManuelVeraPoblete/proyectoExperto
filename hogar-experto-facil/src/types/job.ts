import { JobStatus } from '@/constants';

// ─── Tipos del dominio Trabajo ────────────────────────────────────────────────

export interface JobBase {
  id: string;
  title: string;
  date: string;
  status: JobStatus | string;
}

export interface ClientJob extends JobBase {
  experto: string | null;
  rating: number | null;
  description?: string;
  originalReview?: string;
}

export interface ExpertoJobOffer extends JobBase {
  client: string;
  location: string;
  budget: string;
}

export interface ExpertoActiveJob extends JobBase {
  client: string;
  payment: string;
  clientId: string;
}

/** Trabajo completado en el historial del experto */
export interface CompletedJob extends JobBase {
  client: string;
  rating: number | null;
  payment: string;
  clientId: string;
  clientRating?: number;
  clientComment?: string;
}

export interface JobRating {
  id: number;
  jobTitle: string;
  client: string;
  rating: number;
  comment: string;
  date: string;
}
