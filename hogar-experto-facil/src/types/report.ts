
export interface Report {
  id: number;
  type: 'review' | 'user' | 'post' | 'language';
  content: string;
  reporter: string;
  reporterId: string;
  reportedUserId?: string;
  reportedUserName?: string;
  reportedContent?: string;
  date: string;
  status: 'pending' | 'reviewed' | 'resolved';
  reason: string;
  description?: string;
}

export interface ReportFormData {
  type: 'review' | 'user' | 'post' | 'language';
  reason: string;
  description: string;
  reportedUserId?: string;
  reportedUserName?: string;
  reportedContent?: string;
}

export const REPORT_REASONS = {
  language: [
    'Lenguaje ofensivo',
    'Insultos o amenazas',
    'Discriminación',
    'Contenido sexual inapropiado',
    'Spam o contenido repetitivo'
  ],
  user: [
    'Comportamiento inapropiado',
    'Sospecha de cuenta falsa',
    'Spam o acoso',
    'Actividad fraudulenta',
    'Violación de términos de servicio'
  ],
  post: [
    'Contenido ofensivo',
    'Información falsa',
    'Contenido sexual inapropiado',
    'Spam',
    'Violación de derechos de autor'
  ],
  review: [
    'Reseña falsa',
    'Lenguaje ofensivo',
    'Información incorrecta',
    'Spam',
    'Comentario inapropiado'
  ]
};
