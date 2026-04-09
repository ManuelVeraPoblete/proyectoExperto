const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rutas de Registro y Login
router.post('/register/client', authController.registerClient);
router.post('/register/expert', authController.registerExpert);
router.post('/register/admin', authController.registerAdmin);
router.post('/login', authController.login);

module.exports = router;
