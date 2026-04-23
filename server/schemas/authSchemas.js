const { z } = require('zod');

const registerClientSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  nombres: z.string().min(2, 'Nombres requeridos').optional(),
  nombre: z.string().min(2).optional(),
  apellidos: z.string().min(2, 'Apellidos requeridos').optional(),
  apellido: z.string().min(2).optional(),
  telefono: z.string().optional(),
  direccion: z.string().optional(),
  region: z.string().optional(),
  provincia: z.string().optional(),
  comuna: z.string().optional(),
}).refine(data => data.nombres || data.nombre, {
  message: 'El nombre es requerido',
  path: ['nombres'],
}).refine(data => data.apellidos || data.apellido, {
  message: 'El apellido es requerido',
  path: ['apellidos'],
});

const registerExpertSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  nombres: z.string().min(2).optional(),
  nombre: z.string().min(2).optional(),
  apellidos: z.string().min(2).optional(),
  apellido: z.string().min(2).optional(),
  telefono: z.string().optional(),
  direccion: z.string().optional(),
  region: z.string().optional(),
  provincia: z.string().optional(),
  comuna: z.string().optional(),
  bio: z.string().optional(),
  subcategoryIds: z.array(z.number()).optional(),
  especialidades: z.array(z.number()).optional(),
  experto_specialties: z.array(z.number()).optional(),
}).refine(data => data.nombres || data.nombre, {
  message: 'El nombre es requerido',
  path: ['nombres'],
}).refine(data => data.apellidos || data.apellido, {
  message: 'El apellido es requerido',
  path: ['apellidos'],
});

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
  newPassword: z.string().min(8, 'La nueva contraseña debe tener al menos 8 caracteres'),
  confirmPassword: z.string().min(1, 'Confirma la nueva contraseña'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

module.exports = { registerClientSchema, registerExpertSchema, loginSchema, changePasswordSchema };
