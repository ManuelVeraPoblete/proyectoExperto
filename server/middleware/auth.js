const jwt = require('jsonwebtoken');
const { AppError } = require('./errorHandler');

/**
 * Verifica que el request tenga un token JWT válido.
 * Agrega req.user = { id, userType } si el token es válido.
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Token de autenticación no proporcionado', 401));
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, userType, iat, exp }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('El token ha expirado', 401));
    }
    return next(new AppError('Token inválido', 401));
  }
};

/**
 * Restringe el acceso a determinados roles.
 * Uso: authorize('admin') o authorize('cliente', 'experto')
 */
const authorize = (...roles) => (req, res, next) => {
  if (!req.user) {
    return next(new AppError('No autenticado', 401));
  }
  if (!roles.includes(req.user.userType)) {
    return next(new AppError('No tienes permiso para realizar esta acción', 403));
  }
  next();
};

module.exports = { authenticate, authorize };
