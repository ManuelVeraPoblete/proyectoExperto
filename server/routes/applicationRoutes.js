const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/jobApplicationController');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { updateApplicationSchema } = require('../schemas/jobSchemas');

/**
 * @swagger
 * /api/applications/mine:
 *   get:
 *     summary: El experto ve sus propias postulaciones
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 */
router.get('/mine', authenticate, authorize('experto'), ctrl.getMyApplications);

/**
 * @swagger
 * /api/applications/{applicationId}:
 *   patch:
 *     summary: El cliente acepta o rechaza una postulación
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/:applicationId', authenticate, authorize('cliente'), validate(updateApplicationSchema), ctrl.updateApplication);

module.exports = router;
