const express = require('express');
const { chat } = require('../controllers/chatController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// POST /api/chat — requiere autenticación, devuelve SSE streaming
router.post('/', authenticate, chat);

module.exports = router;
