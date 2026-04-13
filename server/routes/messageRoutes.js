const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { sendMessageSchema } = require('../schemas/messageSchemas');

router.get('/conversations', authenticate, messageController.getConversations);
router.get('/:otherUserId', authenticate, messageController.getMessages);
router.post('/', authenticate, validate(sendMessageSchema), messageController.sendMessage);
router.patch('/:otherUserId/read', authenticate, messageController.markAsRead);

module.exports = router;
