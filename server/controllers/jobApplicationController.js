const JobApplication = require('../models/JobApplication');
const Job = require('../models/Job');
const ExpertoProfile = require('../models/ExpertoProfile');
const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');

/**
 * POST /api/jobs/:jobId/apply
 * Un experto se postula a un trabajo.
 */
exports.applyToJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const expertId = req.user.id;

    const job = await Job.findByPk(jobId);
    if (!job) return next(new AppError('Trabajo no encontrado', 404));

    if (job.estado !== 'activo') {
      return next(new AppError('Este trabajo no está disponible para postulaciones', 400));
    }

    // Evitar postulación duplicada
    const existing = await JobApplication.findOne({ where: { jobId, expertId } });
    if (existing) return next(new AppError('Ya te has postulado a este trabajo', 409));

    const { mensaje, presupuesto_ofrecido } = req.body;
    const application = await JobApplication.create({
      jobId,
      expertId,
      mensaje,
      presupuesto_ofrecido: presupuesto_ofrecido || null,
    });

    res.status(201).json(application);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/jobs/:jobId/applications
 * El cliente dueño del trabajo ve las postulaciones recibidas.
 */
exports.getApplicationsForJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const clientId = req.user.id;

    const job = await Job.findByPk(jobId);
    if (!job) return next(new AppError('Trabajo no encontrado', 404));

    if (job.clientId !== clientId) {
      return next(new AppError('No tienes permiso para ver estas postulaciones', 403));
    }

    const applications = await JobApplication.findAll({
      where: { jobId },
      include: [
        {
          model: User,
          as: 'Experto',
          attributes: ['id', 'email', 'nombres', 'apellidos'],
          include: [{ model: ExpertoProfile, as: 'ExpertoProfile' }],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(applications);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/applications/mine
 * El experto ve sus propias postulaciones.
 */
exports.getMyApplications = async (req, res, next) => {
  try {
    const expertId = req.user.id;

    const applications = await JobApplication.findAll({
      where: { expertId },
      include: [
        {
          model: Job,
          as: 'Trabajo',
          attributes: ['id', 'titulo', 'descripcion', 'estado', 'region', 'comuna'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(applications);
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/applications/:applicationId
 * El cliente acepta o rechaza una postulación.
 * Al aceptar, el trabajo pasa a "en_proceso" y las demás postulaciones se rechazan.
 */
exports.updateApplication = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const clientId = req.user.id;
    const { estado } = req.body;

    const application = await JobApplication.findByPk(applicationId, {
      include: [{ model: Job, as: 'Trabajo' }],
    });

    if (!application) return next(new AppError('Postulación no encontrada', 404));

    if (application.Trabajo.clientId !== clientId) {
      return next(new AppError('No tienes permiso para modificar esta postulación', 403));
    }

    if (application.estado !== 'pendiente') {
      return next(new AppError('Esta postulación ya fue procesada', 400));
    }

    application.estado = estado;
    await application.save();

    // Si se acepta: cambiar estado del trabajo y rechazar las demás
    if (estado === 'aceptado') {
      await Job.update(
        { estado: 'en_proceso', expertId: application.expertId },
        { where: { id: application.jobId } }
      );
      await JobApplication.update(
        { estado: 'rechazado' },
        { where: { jobId: application.jobId, id: { [require('sequelize').Op.ne]: applicationId } } }
      );
    }

    res.json({ message: `Postulación ${estado}`, application });
  } catch (err) {
    next(err);
  }
};
