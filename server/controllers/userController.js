const User = require('../models/User');
const ClienteProfile = require('../models/ClienteProfile');
const ExpertoProfile = require('../models/ExpertoProfile');

// --- ACTUALIZAR AVATAR ---
exports.uploadAvatar = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!req.file) return res.status(400).json({ error: 'No se subió ningún archivo' });

    const avatarUrl = `/uploads/${req.file.filename}`;
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    let profile;
    if (user.user_type === 'cliente') {
      profile = await ClienteProfile.findOne({ where: { userId } });
    } else if (user.user_type === 'experto') {
      profile = await ExpertoProfile.findOne({ where: { userId } });
    }

    if (!profile) return res.status(404).json({ error: 'Perfil no encontrado' });

    profile.avatar_url = avatarUrl;
    await profile.save();

    res.json({ message: 'Avatar actualizado con éxito', avatarUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
