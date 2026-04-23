const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const { registerClientSchema, registerExpertSchema, loginSchema, changePasswordSchema } = require('../schemas/authSchemas');

// Límite estricto para autenticación: 10 intentos cada 15 minutos
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Demasiados intentos. Intenta nuevamente en 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Límite para registro: 5 registros por hora por IP
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: 'Has alcanzado el límite de registros. Intenta en 1 hora.' },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * @swagger
 * /api/auth/register/client:
 *   post:
 *     summary: Registra un nuevo cliente
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterClient'
 *     responses:
 *       201:
 *         description: Cliente registrado con éxito
 *       400:
 *         description: Datos inválidos
 */
router.post('/register/client', registerLimiter, validate(registerClientSchema), authController.registerClient);

/**
 * @swagger
 * /api/auth/register/expert:
 *   post:
 *     summary: Registra un nuevo experto
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterExpert'
 *     responses:
 *       201:
 *         description: Experto registrado con éxito
 */
router.post('/register/expert', registerLimiter, validate(registerExpertSchema), authController.registerExpert);

/**
 * @swagger
 * /api/auth/register/admin:
 *   post:
 *     summary: Registra un administrador (solo uso interno)
 *     tags: [Auth]
 */
router.post('/register/admin', authenticate, authorize('admin'), authLimiter, authController.registerAdmin);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Inicia sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Login exitoso, retorna token JWT
 *       401:
 *         description: Credenciales incorrectas
 */
router.post('/login', authLimiter, validate(loginSchema), authController.login);

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     summary: Cambia la contraseña del usuario autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword, confirmPassword]
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 minLength: 8
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contraseña actualizada correctamente
 *       400:
 *         description: La nueva contraseña debe ser diferente a la actual
 *       401:
 *         description: Contraseña actual incorrecta
 */
router.post('/change-password', authenticate, authLimiter, validate(changePasswordSchema), authController.changePassword);

/**
 * @swagger
 * /api/auth/verify-email:
 *   post:
 *     summary: Verifica el correo electrónico con el token recibido
 *     tags: [Auth]
 */
router.post('/verify-email', authController.verifyEmail);

/**
 * @swagger
 * /api/auth/resend-verification:
 *   post:
 *     summary: Reenvía el correo de verificación al usuario autenticado
 *     tags: [Auth]
 */
router.post('/resend-verification', authenticate, authLimiter, authController.resendVerification);

module.exports = router;
