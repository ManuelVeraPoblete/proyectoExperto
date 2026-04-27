const multer = require('multer');

const MIME_TO_EXT = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

const fileFilter = (req, file, cb) => {
  if (MIME_TO_EXT[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error('Formato de imagen no soportado. Usa JPG, PNG o WEBP.'), false);
  }
};

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

const uploadPortfolio = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
}).array('photos', 3);

module.exports = { upload, uploadPortfolio };
