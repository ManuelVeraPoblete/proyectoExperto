const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate, authorize('admin'));

router.get('/stats', adminController.getStats);
router.get('/experts', adminController.getExpertos);
router.patch('/experts/:id/status', adminController.updateExpertoStatus);
router.get('/audit-logs', adminController.getAuditLogs);

module.exports = router;
