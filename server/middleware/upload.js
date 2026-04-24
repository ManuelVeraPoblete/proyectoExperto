const multer = require('multer');

// Mapa de mimetype a extensión segura (no se confía en el nombre original del archivo)
const MIME_TO_EXT = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

// Filtro para solo permitir imágenes
const fileFilter = (req, file, cb) => {
  if (MIME_TO_EXT[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error('Formato de imagen no soportado. Usa JPG, PNG o WEBP.'), false);
  }
};

const safeExt = (file) => MIME_TO_EXT[file.mimetype] || '.jpg';

// Almacenamiento general
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'file-' + uniqueSuffix + safeExt(file));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

// Almacenamiento para fotos de trabajos del experto (hasta 3 fotos)
const expertoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/experto/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'trabajo-' + uniqueSuffix + safeExt(file));
  },
});

const uploadPortfolio = multer({
  storage: expertoStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB por foto
}).array('photos', 3);

module.exports = { upload, uploadPortfolio };
