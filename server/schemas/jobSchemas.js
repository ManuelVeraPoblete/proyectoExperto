const { z } = require('zod');

const createJobSchema = z.object({
  titulo: z.string().min(5, 'El título debe tener al menos 5 caracteres').optional(),
  title: z.string().min(5).optional(),
  descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres').optional(),
  description: z.string().min(10).optional(),
  category_id: z.union([z.string(), z.number()]).optional(),
  categoryId: z.union([z.string(), z.number()]).optional(),
  region: z.string().optional(),
  provincia: z.string().optional(),
  comuna: z.string().optional(),
  presupuesto: z.union([z.string(), z.number()]).optional(),
  budget: z.union([z.string(), z.number()]).optional(),
  urgencia: z.enum(['baja', 'media', 'alta']).optional(),
  urgency: z.string().optional(),
  direccion: z.string().optional(),
  address: z.string().optional(),
  fecha_preferida: z.string().optional(),
  preferred_date: z.string().optional(),
}).refine(data => data.titulo || data.title, {
  message: 'El título es requerido',
  path: ['titulo'],
}).refine(data => data.descripcion || data.description, {
  message: 'La descripción es requerida',
  path: ['descripcion'],
}).refine(data => data.category_id || data.categoryId, {
  message: 'La categoría es requerida',
  path: ['category_id'],
});

const applyJobSchema = z.object({
  mensaje: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
  presupuesto_ofrecido: z.number().positive('El presupuesto debe ser positivo').optional(),
});

const updateApplicationSchema = z.object({
  estado: z.enum(['aceptado', 'rechazado'], {
    errorMap: () => ({ message: 'Estado debe ser "aceptado" o "rechazado"' }),
  }),
});

const closeJobSchema = z.object({
  calificacion: z.coerce.number().min(1).max(5),
  resena: z.string().max(1000).optional(),
});

module.exports = { createJobSchema, applyJobSchema, updateApplicationSchema, closeJobSchema };
