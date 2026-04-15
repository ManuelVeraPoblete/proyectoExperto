import { ExpertoCardData, PortfolioItem, Review } from '@/types/experto';
import { toAbsoluteUrl } from '@/lib/api-config';

interface ApiCategory {
  nombre?: string;
  name?: string;
}

interface ApiSubcategory {
  Category?: ApiCategory;
  category?: ApiCategory;
}

export interface ApiExperto {
  id: string | number;
  userId?: string;
  User?: { id: string; email?: string };
  nombres?: string;
  nombre?: string;
  apellidos?: string;
  apellido?: string;
  avatar?: string;
  avatar_url?: string;
  fotoPerfil?: string;
  Categories?: ApiCategory[];
  categories?: ApiCategory[];
  especialidades?: Array<ApiCategory | string>;
  specialties?: Array<ApiCategory | string>;
  Subcategories?: ApiSubcategory[];
  subcategories?: ApiSubcategory[];
  categoria?: string;
  category?: string;
  avg_portfolio_rating?: string | number | null;
  portfolio_review_count?: string | number | null;
  rating?: string | number;
  calificacion?: string | number;
  reviews?: string | number | Review[];
  reviews_list?: Review[];
  reviewCount?: string | number;
  experience?: string;
  hourlyRate?: number;
  isVerified?: boolean;
  telefono?: string;
  direccion?: string;
  comuna?: string;
  region?: string;
  completed_jobs?: PortfolioItem[];
}

const extractCategoryNames = (experto: ApiExperto): string[] => {
  const names: string[] = [];

  const categorySources = [
    experto.Categories,
    experto.categories,
    experto.especialidades,
    experto.specialties,
  ];

  categorySources.forEach(source => {
    if (!Array.isArray(source)) return;
    source.forEach(item => {
      if (typeof item === 'string') {
        names.push(item);
      } else if (item && typeof item === 'object') {
        const name = (item as ApiCategory).nombre ?? (item as ApiCategory).name;
        if (name) names.push(name);
      }
    });
  });

  const subSources = [experto.Subcategories, experto.subcategories];
  subSources.forEach(source => {
    if (!Array.isArray(source)) return;
    source.forEach(sub => {
      const parent = sub.Category ?? sub.category;
      const parentName = parent?.nombre ?? parent?.name;
      if (parentName) names.push(parentName);
    });
  });

  const unique = Array.from(new Set(names)).filter(Boolean);

  if (unique.length === 0) {
    const fallback = experto.categoria ?? experto.category;
    if (fallback) unique.push(fallback);
  }

  return unique;
};

const extractReviewCount = (experto: ApiExperto): number => {
  if (typeof experto.reviewCount === 'number') return experto.reviewCount;
  if (typeof experto.reviews === 'number') return experto.reviews;
  return 0;
};

export const mapApiExpertoToCardData = (experto: ApiExperto): ExpertoCardData => ({
  id: experto.userId ?? experto.User?.id ?? String(experto.id),
  nombres: experto.nombres ?? experto.nombre ?? '',
  apellidos: experto.apellidos ?? experto.apellido ?? '',
  avatar: toAbsoluteUrl(experto.avatar_url ?? experto.avatar ?? experto.fotoPerfil),
  especialidades: extractCategoryNames(experto),
  calificacion: experto.avg_portfolio_rating != null
    ? parseFloat(String(experto.avg_portfolio_rating))
    : parseFloat(String(experto.rating ?? experto.calificacion ?? 0)),
  reviewCount: experto.portfolio_review_count != null
    ? Number(experto.portfolio_review_count)
    : extractReviewCount(experto),
  comuna: experto.comuna ?? '',
  region: experto.region ?? '',
  experience: experto.experience ?? '5+ años',
  hourlyRate: experto.hourlyRate ?? 25000,
  isVerified: experto.isVerified ?? true,
  telefono: experto.telefono ?? '',
  direccion: experto.direccion ?? '',
  reviews: Array.isArray(experto.reviews_list) ? experto.reviews_list : [],
  completedJobs: experto.completed_jobs ?? [],
});
