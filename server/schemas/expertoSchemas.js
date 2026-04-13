const { z } = require('zod');

const expertoUpdateSchema = z.object({
  nombres: z.string().min(2).max(100).optional(),
  apellidos: z.string().min(2).max(100).optional(),
  telefono: z.string().max(20).optional(),
  bio: z.string().max(1000).optional(),
  region: z.string().max(100).optional(),
  provincia: z.string().max(100).optional(),
  comuna: z.string().max(100).optional(),
});

module.exports = { expertoUpdateSchema };
