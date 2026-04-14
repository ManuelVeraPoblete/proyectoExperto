const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const jobApplicationRoutes = require('./jobApplicationRoutes');
const { upload, uploadPortfolio } = require('../middleware/upload');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { closeJobSchema } = require('../schemas/jobSchemas');

/**
 * @swagger
 * /api/jobs:
 *   post:
 *     summary: Crea un nuevo trabajo (solo clientes)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *   get:
 *     summary: Lista trabajos con filtros opcionales
 *     tags: [Jobs]
 */
router.post('/', authenticate, authorize('cliente'), upload.any(), jobController.createJob);
router.get('/', jobController.getJobs);
router.patch('/:id/close', authenticate, authorize('cliente'), uploadPortfolio, validate(closeJobSchema), jobController.closeJob);

// Montar sub-rutas de postulaciones: /api/jobs/:jobId/apply y /api/jobs/:jobId/applications
router.use('/:jobId', jobApplicationRoutes);

module.exports = router;
