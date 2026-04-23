const { Op } = require('sequelize');
const ExpertoProfile = require('../models/ExpertoProfile');
const User = require('../models/User');
const Job = require('../models/Job');
const Subcategory = require('../models/Subcategory');
const AuditLog = require('../models/AuditLog');
const logger = require('../config/logger');
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

    const previousStatus = profile.verificationStatus;
    await profile.update({ verificationStatus: status });

    const admin = await User.findByPk(req.user.id, { attributes: ['nombres', 'apellidos'] });

    await AuditLog.create({
      adminId: req.user.id,
      adminName: admin ? `${admin.nombres} ${admin.apellidos}` : 'Admin',
      action: 'UPDATE_EXPERTO_STATUS',
      targetId: id,
      targetType: 'ExpertoProfile',
      details: {
        from: previousStatus,
        to: status,
        expertNombres: profile.nombres,
        expertApellidos: profile.apellidos,
      },
      ip: req.ip,
    });

    logger.info(`Admin ${req.user.id} cambió estado de experto ${id}: ${previousStatus} → ${status}`);

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

exports.getAuditLogs = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const offset = parseInt(req.query.offset) || 0;

    const { count, rows } = await AuditLog.findAndCountAll({
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    res.json({ total: count, logs: rows });
  } catch (err) {
    next(err);
  }
};
