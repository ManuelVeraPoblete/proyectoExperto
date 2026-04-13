import { apiClient } from '@/lib/apiClient';

export interface PortfolioReaction {
  id: number;
  portfolioItemId: number;
  userId: string;
  reaction: 'heart' | 'like' | 'clap' | 'dislike';
  Reactor?: { id: string; nombres: string; apellidos: string };
}

export interface PortfolioReview {
  id: number;
  portfolioItemId: number;
  userId: string;
  comment: string;
  rating: number;
  Reviewer?: { id: string; nombres: string; apellidos: string };
  createdAt: string;
}

export interface PortfolioItem {
  id: number;
  expertoId: string;
  title: string;
  description?: string;
  category?: string;
  image_url?: string;
  date?: string;
  Reactions?: PortfolioReaction[];
  Reviews?: PortfolioReview[];
  createdAt: string;
}

export const portfolioService = {
  getByExpert: (expertUserId: string): Promise<PortfolioItem[]> =>
    apiClient.get<PortfolioItem[]>(`/portfolio/${expertUserId}`),

  create: (data: { title: string; description?: string; category?: string; image_url?: string; date?: string }): Promise<PortfolioItem> =>
    apiClient.post<PortfolioItem>('/portfolio', data),

  remove: (itemId: number): Promise<{ message: string }> =>
    apiClient.delete<{ message: string }>(`/portfolio/${itemId}`),

  react: (itemId: number, reaction: string): Promise<{ action: 'added' | 'removed' | 'changed'; reaction: string }> =>
    apiClient.post<{ action: 'added' | 'removed' | 'changed'; reaction: string }>(`/portfolio/${itemId}/react`, { reaction }),

  addReview: (itemId: number, data: { comment: string; rating: number }): Promise<PortfolioReview> =>
    apiClient.post<PortfolioReview>(`/portfolio/${itemId}/reviews`, data),
};
