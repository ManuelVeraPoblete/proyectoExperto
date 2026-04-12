const express = require('express');
const router = express.Router();
const expertController = require('../controllers/expertController');

router.get('/', expertController.getExperts);

module.exports = router;
