const express = require('express');
const router = express.Router();
const expertController = require('../controllers/expertController');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { expertoUpdateSchema } = require('../schemas/expertoSchemas');

router.get('/', expertController.getExperts);
router.get('/featured', expertController.getFeaturedExperts);
router.patch('/profile', authenticate, authorize('experto'), validate(expertoUpdateSchema), expertController.updateExpertProfile);
// /:userId must come after static routes
router.get('/:userId', expertController.getExpertById);

module.exports = router;
