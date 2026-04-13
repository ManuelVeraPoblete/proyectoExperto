const multer = require('multer');
const path = require('path');

// Filtro para solo permitir imágenes
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Formato de imagen no soportado. Usa JPG, PNG o WEBP.'), false);
  }
};

// Almacenamiento general
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'file-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 25 * 1024 * 1024 }
});

// Almacenamiento para fotos de trabajos del experto (hasta 3 fotos)
const expertoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/experto/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'trabajo-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadPortfolio = multer({
  storage: expertoStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB por foto
}).array('photos', 3);

module.exports = { upload, uploadPortfolio };
