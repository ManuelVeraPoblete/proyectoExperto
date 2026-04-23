const { Op } = require('sequelize');
const ExpertoProfile = require('../models/ExpertoProfile');
const User = require('../models/User');
const Job = require('../models/Job');
const Subcategory = require('../models/Subcategory');
const { AppError } = require('../middleware/errorHandler');

exports.getExpertos = async (req, res, next) => {
  try {
    const profiles = await ExpertoProfile.findAll({
      include: [
        { model: User, attributes: ['id', 'email'] },
        { model: Subcategory, as: 'Subcategories', required: false, attributes: ['name'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    const items = profiles.map(p => ({
      id: p.userId,
      nombres: p.nombres,
      apellidos: p.apellidos,
      email: p.User?.email ?? '',
      telefono: p.telefono ?? undefined,
      especialidades: (p.Subcategories ?? []).map(s => s.name),
      verificationStatus: p.verificationStatus,
      createdAt: p.createdAt,
    }));

    res.json(items);
  } catch (err) {
    next(err);
  }
};

exports.updateExpertoStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const VALID = ['pendiente', 'activo', 'anulado'];
    if (!VALID.includes(status)) {
      return next(new AppError(`Estado inválido: ${status}`, 400));
    }

    const profile = await ExpertoProfile.findOne({ where: { userId: id } });
    if (!profile) return next(new AppError('Experto no encontrado', 404));

    await profile.update({ verificationStatus: status });
    res.json({ id, verificationStatus: status });
  } catch (err) {
    next(err);
  }
};

exports.getStats = async (req, res, next) => {
  try {
    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalUsers, activeExperts, jobsThisMonth] = await Promise.all([
      User.count(),
      ExpertoProfile.count({ where: { verificationStatus: 'activo' } }),
      Job.count({ where: { createdAt: { [Op.gte]: firstOfMonth } } }),
    ]);

    res.json({ totalUsers, activeExperts, jobsThisMonth });
  } catch (err) {
    next(err);
  }
};
