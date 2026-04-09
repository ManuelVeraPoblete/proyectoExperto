const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const upload = require('../middleware/upload');

// Ruta para crear un trabajo con cualquier campo de archivos (hasta 5 fotos)
router.post('/', upload.any(), jobController.createJob);

// Ruta para obtener todos los trabajos (para que los expertos puedan verlos)
router.get('/', jobController.getJobs);

module.exports = router;
