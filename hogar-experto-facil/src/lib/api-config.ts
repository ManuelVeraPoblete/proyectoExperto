export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
export const SERVER_URL = API_BASE_URL.replace(/\/api$/, '');

/** Convierte rutas relativas del backend (/uploads/...) en URLs absolutas */
export const toAbsoluteUrl = (url: string | null | undefined): string | undefined => {
  if (!url) return undefined;
  return url.startsWith('http') ? url : `${SERVER_URL}${url}`;
};