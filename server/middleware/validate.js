const { AppError } = require('./errorHandler');

/**
 * Middleware de validación reutilizable con Zod.
 * Uso: router.post('/ruta', validate(miSchema), controller)
 */
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const issues = result.error.issues || result.error.errors || [];
    const messages = issues.map(e => `${e.path.join('.')}: ${e.message}`);
    return next(new AppError(messages.join(' | '), 400));
  }
  // Reemplazar body con los datos validados/transformados
  req.body = result.data;
  next();
};

module.exports = validate;
