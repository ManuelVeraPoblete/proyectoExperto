export * from './maestro';
export * from './experto';
// job.ts exports CompletedJob too; import selectively to avoid conflict
export type { JobBase, ClientJob as ClientJobType, ExpertoJobOffer, ExpertoActiveJob, JobRating } from './job';

export interface Message {
  id: string;
  sender: 'me' | 'other' | 'user' | 'agent';
  text: string;
  timestamp: string;
  read?: boolean;
}

export interface Client {
  id: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono?: string;
  direccion?: string;
  region?: string;
  provincia?: string;
  comuna?: string;
  avatar?: string;
  fotoPerfil?: string;
  jobCount: number;
  averageRating: number;
  reviewsGiven: {
    experto: string;
    rating: number;
    comment: string;
  }[];
}

export interface Trabajo {
  id: string;
  clientId: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  region: string;
  provincia: string;
  comuna: string;
  presupuesto: number;
  fechaCreacion: string;
  createdAt?: string;
  estado: string;
  cliente: Client;
  images?: string[];
  expertId?: string;
  calificacion?: number;
  resena?: string;
  Experto?: { id: string; nombres: string; apellidos: string } | null;
  Fotos?: { id: number; photo_url: string }[];
  cliente_nombres?: string;
  cliente_apellidos?: string;
  proposalCount?: number;
}
