import { API_BASE_URL } from './api-config';
import { logger } from './logger';
import { storageService } from '@/services/storageService';

// ─── Error tipado ────────────────────────────────────────────────────────────
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ─── Tipos internos ──────────────────────────────────────────────────────────
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

// ─── Función base de petición ────────────────────────────────────────────────
const request = async <T>(
  method: HttpMethod,
  endpoint: string,
  body?: unknown,
  options: RequestOptions = {},
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;

  const token = storageService.getUser()?.token;
  const authHeaders: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...options.headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal: options.signal,
  });

  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    logger.error(`[API] ${method} ${url} → ${response.status}`, message);
    throw new ApiError(response.status, message);
  }

  return response.json() as Promise<T>;
};

// ─── Upload con FormData (sin Content-Type para que el browser lo ponga) ─────
const uploadForm = async <T>(endpoint: string, formData: FormData, method: 'POST' | 'PATCH' = 'POST'): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = storageService.getUser()?.token;
  const authHeaders: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

  const response = await fetch(url, {
    method,
    headers: authHeaders,
    body: formData,
  });

  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    logger.error(`[API] ${method} ${url} → ${response.status}`, message);
    throw new ApiError(response.status, message);
  }

  return response.json() as Promise<T>;
};

// ─── Cliente HTTP público ─────────────────────────────────────────────────────
export const apiClient = {
  get:        <T>(endpoint: string, opts?: RequestOptions)               => request<T>('GET',    endpoint, undefined, opts),
  post:       <T>(endpoint: string, body: unknown, opts?: RequestOptions) => request<T>('POST',   endpoint, body,      opts),
  put:        <T>(endpoint: string, body: unknown, opts?: RequestOptions) => request<T>('PUT',    endpoint, body,      opts),
  patch:      <T>(endpoint: string, body: unknown, opts?: RequestOptions) => request<T>('PATCH',  endpoint, body,      opts),
  delete:     <T>(endpoint: string, opts?: RequestOptions)               => request<T>('DELETE', endpoint, undefined, opts),
  postForm:   <T>(endpoint: string, formData: FormData)                  => uploadForm<T>(endpoint, formData, 'POST'),
  patchForm:  <T>(endpoint: string, formData: FormData)                  => uploadForm<T>(endpoint, formData, 'PATCH'),
};
