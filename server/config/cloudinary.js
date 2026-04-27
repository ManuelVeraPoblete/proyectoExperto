const { v2: cloudinary } = require('cloudinary');
const logger = require('./logger');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadBuffer = (buffer, folder) =>
  new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder, resource_type: 'image' }, (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      })
      .end(buffer);
  });

const deleteByUrl = async (url) => {
  try {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
    if (match) await cloudinary.uploader.destroy(match[1]);
  } catch (err) {
    logger.warn(`[Cloudinary] No se pudo eliminar imagen: ${err.message}`);
  }
};

module.exports = { uploadBuffer, deleteByUrl };
