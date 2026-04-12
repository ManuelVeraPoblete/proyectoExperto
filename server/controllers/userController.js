const User = require('../models/User');
const ClienteProfile = require('../models/ClienteProfile');
const ExpertoProfile = require('../models/ExpertoProfile');
const { AppError } = require('../middleware/errorHandler');

exports.uploadAvatar = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Solo permite actualizar el propio avatar (o ser admin)
    if (req.user.id !== userId && req.user.userType !== 'admin') {
      return next(new AppError('No puedes modificar el avatar de otro usuario', 403));
    }

    if (!req.file) return next(new AppError('No se subió ningún archivo', 400));

    const avatarUrl = `/uploads/${req.file.filename}`;
    const user = await User.findByPk(userId);
    if (!user) return next(new AppError('Usuario no encontrado', 404));

    let profile;
    if (user.user_type === 'cliente') {
      profile = await ClienteProfile.findOne({ where: { userId } });
    } else if (user.user_type === 'experto') {
      profile = await ExpertoProfile.findOne({ where: { userId } });
    }

    if (!profile) return next(new AppError('Perfil no encontrado', 404));

    profile.avatar_url = avatarUrl;
    await profile.save();

    res.json({ message: 'Avatar actualizado con éxito', avatarUrl });
  } catch (error) {
    next(error);
  }
};
