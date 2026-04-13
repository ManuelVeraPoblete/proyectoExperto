const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { portfolioItemSchema, reactSchema, reviewSchema } = require('../schemas/portfolioSchemas');

router.get('/:expertUserId', portfolioController.getPortfolio);
router.post('/', authenticate, authorize('experto'), validate(portfolioItemSchema), portfolioController.createItem);
router.delete('/:itemId', authenticate, authorize('experto'), portfolioController.deleteItem);
router.post('/:itemId/react', authenticate, validate(reactSchema), portfolioController.reactToItem);
router.post('/:itemId/reviews', authenticate, authorize('cliente'), validate(reviewSchema), portfolioController.addReview);

module.exports = router;
