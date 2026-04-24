const logger = require('../config/logger');

class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Error esperado/controlado
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Middleware global de errores. Debe ser el último middleware registrado.
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  // Errores de Sequelize: campo único duplicado
  if (err.name === 'SequelizeUniqueConstraintError') {
    const field = err.errors?.[0]?.path || 'campo';
    return res.status(409).json({ error: `El ${field} ya está registrado` });
  }

  // Errores de Sequelize: validación de modelo
  if (err.name === 'SequelizeValidationError') {
    const messages = err.errors.map(e => e.message);
    return res.status(400).json({ error: 'Error de validación', detalles: messages });
  }

  // Errores de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Token inválido' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'El token ha expirado' });
  }

  // Log del error
  if (statusCode >= 500) {
    logger.error(`${req.method} ${req.url} → ${statusCode}: ${err.message}`, {
      stack: err.stack,
    });
  } else {
    logger.warn(`${req.method} ${req.url} → ${statusCode}: ${err.message}`);
  }

  res.status(statusCode).json({
    error: err.message || 'Error interno del servidor',
    // En producción no exponemos el stack
    ...(isProduction ? {} : { stack: err.stack }),
  });
};

module.exports = { AppError, errorHandler };
