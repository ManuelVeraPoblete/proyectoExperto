const express = require('express');
const router = express.Router({ mergeParams: true }); // Para acceder a :jobId del router padre
const ctrl = require('../controllers/jobApplicationController');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { applyJobSchema, updateApplicationSchema } = require('../schemas/jobSchemas');

/**
 * @swagger
 * /api/jobs/{jobId}/apply:
 *   post:
 *     summary: Un experto se postula a un trabajo
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 */
router.post('/apply', authenticate, authorize('experto'), validate(applyJobSchema), ctrl.applyToJob);

/**
 * @swagger
 * /api/jobs/{jobId}/applications:
 *   get:
 *     summary: El cliente ve las postulaciones de su trabajo
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 */
router.get('/applications', authenticate, authorize('cliente'), ctrl.getApplicationsForJob);

module.exports = router;
