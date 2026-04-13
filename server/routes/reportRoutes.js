const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createReportSchema, updateReportStatusSchema } = require('../schemas/reportSchemas');

router.post('/', authenticate, validate(createReportSchema), reportController.createReport);
router.get('/', authenticate, authorize('admin'), reportController.getReports);
router.patch('/:id', authenticate, authorize('admin'), validate(updateReportStatusSchema), reportController.updateReportStatus);

module.exports = router;
