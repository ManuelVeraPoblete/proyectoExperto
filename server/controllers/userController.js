const { literal } = require('sequelize');
const User = require('../models/User');
const ClienteProfile = require('../models/ClienteProfile');
const ExpertoProfile = require('../models/ExpertoProfile');
const Job = require('../models/Job');
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

exports.getUserStats = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user.id !== id && req.user.userType !== 'admin') {
      return next(new AppError('No tienes permiso para ver estas estadísticas', 403));
    }

    const user = await User.findByPk(id);
    if (!user) return next(new AppError('Usuario no encontrado', 404));

    const isExperto = user.user_type === 'experto';

    if (isExperto) {
      const [rows] = await Job.sequelize.query(
        `SELECT
           COUNT(*) AS totalJobs,
           SUM(CASE WHEN estado = 'completado' THEN 1 ELSE 0 END) AS completedJobs,
           SUM(CASE WHEN estado = 'en_proceso' THEN 1 ELSE 0 END) AS activeJobs,
           AVG(CASE WHEN calificacion IS NOT NULL THEN calificacion END) AS avgCalificacion
         FROM jobs
         WHERE expertId = :userId`,
        { replacements: { userId: id } }
      );
      const s = rows[0] || {};
      res.json({
        totalJobs: parseInt(s.totalJobs) || 0,
        completedJobs: parseInt(s.completedJobs) || 0,
        activeJobs: parseInt(s.activeJobs) || 0,
        avgCalificacion: s.avgCalificacion ? parseFloat(parseFloat(s.avgCalificacion).toFixed(1)) : null,
      });
    } else {
      const [rows] = await Job.sequelize.query(
        `SELECT
           COUNT(*) AS totalJobs,
           SUM(CASE WHEN estado = 'completado' THEN 1 ELSE 0 END) AS completedJobs,
           SUM(CASE WHEN estado = 'en_proceso' THEN 1 ELSE 0 END) AS activeJobs,
           SUM(CASE WHEN estado = 'activo' THEN 1 ELSE 0 END) AS pendingJobs
         FROM jobs
         WHERE clientId = :userId`,
        { replacements: { userId: id } }
      );
      const s = rows[0] || {};
      res.json({
        totalJobs: parseInt(s.totalJobs) || 0,
        completedJobs: parseInt(s.completedJobs) || 0,
        activeJobs: parseInt(s.activeJobs) || 0,
        pendingJobs: parseInt(s.pendingJobs) || 0,
      });
    }
  } catch (error) {
    next(error);
  }
};
