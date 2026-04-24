const Report = require('../models/Report');
const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');

exports.createReport = async (req, res, next) => {
  try {
    const reporterId = req.user.id;
    const { type, reason, description, reportedUserId, reportedContent } = req.body;

    const report = await Report.create({
      type,
      reason,
      description: description || null,
      reporterId,
      reportedUserId: reportedUserId || null,
      reportedContent: reportedContent || null,
    });

    res.status(201).json({ message: 'Reporte enviado', report });
  } catch (err) {
    next(err);
  }
};

exports.getReports = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;

    const { count, rows: reports } = await Report.findAndCountAll({
      include: [
        { model: User, as: 'Reporter', attributes: ['id', 'nombres', 'apellidos', 'email'] },
        { model: User, as: 'ReportedUser', attributes: ['id', 'nombres', 'apellidos', 'email'] },
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    res.json({ reports, total: count, page, totalPages: Math.ceil(count / limit) });
  } catch (err) {
    next(err);
  }
};

exports.updateReportStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const report = await Report.findByPk(id);
    if (!report) return next(new AppError('Reporte no encontrado', 404));

    await report.update({ status });
    res.json({ message: 'Estado actualizado', report });
  } catch (err) {
    next(err);
  }
};
