import { ROLES, UserRole } from '@/constants';
import { toAbsoluteUrl } from '@/lib/api-config';

export interface NormalizedUser {
  id: string;
  nombres: string;
  apellidos: string;
  email: string;
  userType: UserRole;
  telefono?: string;
  direccion?: string;
  region?: string;
  provincia?: string;
  comuna?: string;
  avatar?: string;
  jobCount?: number;
  averageRating?: number;
  calificacion?: number;
  reviewCount?: number;
  especialidades?: string[];
  experience?: string;
  hourlyRate?: number;
  isVerified?: boolean;
  adminLevel?: string;
  lastAccess?: string;
  token?: string;
}

type RawData = Record<string, unknown>;

const extractRawUser = (data: RawData): RawData => {
  const nested = data?.user ?? (data?.data as RawData)?.user ?? data?.data ?? data;
  return (nested as RawData) ?? {};
};

const extractProfile = (rawUser: RawData): RawData =>
  (rawUser.profile as RawData) ?? {};

const mapRole = (rawRole: unknown): UserRole => {
  if (rawRole === 'admin'   || rawRole === 1 || rawRole === '1') return ROLES.ADMIN;
  if (rawRole === 'experto' || rawRole === 'expert' || rawRole === 2 || rawRole === '2') return ROLES.EXPERTO;
  if (rawRole === 'client'  || rawRole === 'cliente' || rawRole === 'customer' || rawRole === 3 || rawRole === '3') return ROLES.CLIENT;
  return ROLES.CLIENT;
};

const coerceString = (value: unknown): string =>
  value !== undefined && value !== null ? String(value) : '';

export const normalizeUser = (data: unknown): NormalizedUser | null => {
  if (!data || typeof data !== 'object') return null;

  const rawUser = extractRawUser(data as RawData);
  if (!rawUser || !rawUser.id) return null;

  const profile = extractProfile(rawUser);

  const nombres = coerceString(
    profile.nombres ?? rawUser.nombres ?? rawUser.nombre ?? rawUser.first_name ?? rawUser.name,
  );
  const apellidos = coerceString(
    profile.apellidos ?? rawUser.apellidos ?? rawUser.apellido ?? rawUser.last_name,
  );

  const rawRole = rawUser.userType ?? rawUser.user_type ?? rawUser.role ?? rawUser.role_id;
  const userType = mapRole(rawRole);

  const rawData = data as RawData;
  const token = coerceString(rawData.token ?? rawUser.token) || undefined;

  return {
    ...(rawUser as Omit<NormalizedUser, 'nombres' | 'apellidos' | 'userType'>),
    id: coerceString(rawUser.id),
    email: coerceString(rawUser.email),
    nombres,
    apellidos,
    userType,
    telefono: coerceString(profile.telefono ?? rawUser.telefono)  || undefined,
    direccion: coerceString(profile.direccion ?? rawUser.direccion) || undefined,
    region:    coerceString(profile.region    ?? rawUser.region)    || undefined,
    provincia: coerceString(profile.provincia ?? rawUser.provincia) || undefined,
    comuna:    coerceString(profile.comuna    ?? rawUser.comuna)    || undefined,
    avatar: toAbsoluteUrl(coerceString(profile.avatar_url ?? profile.avatar ?? rawUser.avatar)) || undefined,
    token,
  };
};
