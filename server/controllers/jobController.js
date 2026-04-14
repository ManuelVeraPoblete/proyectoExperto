const { Op } = require('sequelize');
const Job = require('../models/Job');
const JobPhoto = require('../models/JobPhoto');
const ClienteProfile = require('../models/ClienteProfile');
const Subcategory = require('../models/Subcategory');
const Category = require('../models/Category');
const User = require('../models/User');
const PortfolioItem = require('../models/PortfolioItem');
const PortfolioReview = require('../models/PortfolioReview');
const logger = require('../config/logger');
const { AppError } = require('../middleware/errorHandler');

/**
 * @swagger
 * /api/jobs:
 *   post:
 *     summary: Crea un nuevo trabajo
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 */
exports.createJob = async (req, res, next) => {
  try {
    const clientId = req.user.id; // viene del token JWT (authenticate middleware)
    const titulo = req.body.titulo || req.body.title;
    const descripcion = req.body.descripcion || req.body.description;
    const categoryId = req.body.category_id || req.body.categoryId;
    const { urgencia, urgency, preferred_date, fecha_preferida, presupuesto, budget, direccion, address } = req.body;
    let { region, provincia, comuna } = req.body;

    // Autocompletar ubicación desde perfil si no viene en el body
    if (!region || !provincia || !comuna) {
      const profile = await ClienteProfile.findOne({ where: { userId: clientId } });
      if (profile) {
        region = region || profile.region;
        provincia = provincia || profile.provincia;
        comuna = comuna || profile.comuna;
      }
    }

    const faltantes = [];
    if (!titulo) faltantes.push('título');
    if (!descripcion) faltantes.push('descripción');
    if (!region) faltantes.push('region');
    if (!provincia) faltantes.push('provincia');
    if (!comuna) faltantes.push('comuna');
    if (!categoryId) faltantes.push('category_id');

    if (faltantes.length > 0) {
      return next(new AppError(`Faltan campos obligatorios: ${faltantes.join(', ')}`, 400));
    }

    const job = await Job.create({
      titulo,
      descripcion,
      presupuesto: (presupuesto || budget) ? parseFloat(presupuesto || budget) : null,
      region,
      provincia,
      comuna,
      direccion: direccion || address || 'No especificada',
      clientId,
      categoryId: parseInt(categoryId),
      urgencia: urgencia || urgency || 'media',
      fecha_preferida: fecha_preferida || preferred_date || null,
    });

    // Guardar fotos (máximo 5)
    if (req.files && req.files.length > 0) {
      const photos = req.files.slice(0, 5).map(file => ({
        jobId: job.id,
        photo_url: `/uploads/${file.filename}`,
      }));
      await JobPhoto.bulkCreate(photos);
    }

    const result = await Job.findByPk(job.id, {
      include: [{ model: JobPhoto, as: 'Fotos' }],
    });

    logger.info(`Trabajo creado: ${job.id} por cliente ${clientId}`);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: Lista trabajos con filtros opcionales
 *     tags: [Jobs]
 */
exports.getJobs = async (req, res, next) => {
  try {
    const { descripcion, categoryId, region, provincia, comuna, clientId, expertId, estado } = req.query;

    const whereClause = {};

    if (descripcion && descripcion.trim()) {
      whereClause.descripcion = { [Op.like]: `%${descripcion}%` };
    }
    if (categoryId && categoryId !== 'all' && categoryId !== '0') {
      whereClause.categoryId = parseInt(categoryId);
    }
    if (region && region !== 'Todas') whereClause.region = region;
    if (provincia && provincia !== 'Todas') whereClause.provincia = provincia;
    if (comuna && comuna !== 'Todas') whereClause.comuna = comuna;
    if (clientId) whereClause.clientId = clientId;
    if (expertId) whereClause.expertId = expertId;
    if (estado) whereClause.estado = estado;

    const jobs = await Job.findAll({
      where: whereClause,
      include: [
        { model: JobPhoto, as: 'Fotos' },
        { model: Subcategory, as: 'Subcategory' },
        { model: Category, as: 'Category' },
        { model: User, as: 'Cliente', attributes: ['id', 'nombres', 'apellidos'] },
        { model: User, as: 'Experto', attributes: ['id', 'nombres', 'apellidos'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    const flattenedJobs = jobs.map(job => {
      const jobJson = job.toJSON();
      const cliente = jobJson.Cliente || {};
      jobJson.cliente_nombres = cliente.nombres;
      jobJson.cliente_apellidos = cliente.apellidos;
      delete jobJson.Cliente;
      return jobJson;
    });

    res.json(flattenedJobs);
  } catch (error) {
    next(error);
  }
};

exports.closeJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const clientId = req.user.id;
    const { calificacion, resena } = req.body;

    const job = await Job.findByPk(id);
    if (!job) return next(new AppError('Trabajo no encontrado', 404));
    if (job.clientId !== clientId) return next(new AppError('No tienes permiso para cerrar este trabajo', 403));
    if (job.estado !== 'en_proceso') return next(new AppError('Solo se pueden cerrar trabajos en proceso', 400));

    await job.update({ estado: 'completado', calificacion, resena: resena || null });

    // Rutas de las fotos subidas
    const imagePaths = (req.files ?? []).map(f => `/uploads/experto/${f.filename}`);

    // Guardar fotos también en JobPhoto (historial del trabajo)
    if (imagePaths.length > 0) {
      await JobPhoto.bulkCreate(imagePaths.map(p => ({ jobId: parseInt(id), photo_url: p })));
    }

    // Auto-crear entrada en el portafolio del experto con fotos y reseña del cliente
    if (job.expertId) {
      let portfolioItem = await PortfolioItem.findOne({
        where: { expertoId: job.expertId, title: job.titulo },
      });

      if (!portfolioItem) {
        portfolioItem = await PortfolioItem.create({
          expertoId: job.expertId,
          title: job.titulo,
          description: job.descripcion || null,
          category: null,
          image_url: imagePaths.length > 0 ? JSON.stringify(imagePaths) : null,
          date: new Date().toISOString().split('T')[0],
        });
      } else if (imagePaths.length > 0) {
        await portfolioItem.update({ image_url: JSON.stringify(imagePaths) });
      }

      // Guardar reseña del cliente (evitar duplicados)
      const existingReview = await PortfolioReview.findOne({
        where: { portfolioItemId: portfolioItem.id, userId: clientId },
      });
      if (!existingReview) {
        await PortfolioReview.create({
          portfolioItemId: portfolioItem.id,
          userId: clientId,
          comment: resena || `Trabajo calificado con ${calificacion} estrella${calificacion !== 1 ? 's' : ''}.`,
          rating: calificacion,
        });
      }
    }

    const updatedJob = await Job.findByPk(id, {
      include: [{ model: JobPhoto, as: 'Fotos' }],
    });

    logger.info(`Trabajo cerrado: ${id} por cliente ${clientId}, calificacion ${calificacion}`);
    res.json({ message: 'Trabajo marcado como completado', job: updatedJob });
  } catch (error) {
    next(error);
  }
};
