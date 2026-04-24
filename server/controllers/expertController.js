const { Op, fn, col, literal } = require('sequelize');
const sequelize = require('../config/database');
const ExpertoProfile = require('../models/ExpertoProfile');
const Subcategory = require('../models/Subcategory');
const Category = require('../models/Category');
const User = require('../models/User');
const Job = require('../models/Job');
const { AppError } = require('../middleware/errorHandler');

const STOPWORDS = new Set(['para', 'con', 'por', 'del', 'las', 'los', 'una', 'uno', 'unos', 'unas', 'que']);

/**
 * @swagger
 * /api/experts:
 *   get:
 *     summary: Busca expertos con filtros opcionales
 *     tags: [Experts]
 *     parameters:
 *       - in: query
 *         name: work
 *         schema:
 *           type: string
 *         description: Texto libre de búsqueda
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: subcategory_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: region
 *         schema:
 *           type: string
 *       - in: query
 *         name: provincia
 *         schema:
 *           type: string
 *       - in: query
 *         name: comuna
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de expertos
 */
exports.getExperts = async (req, res, next) => {
  try {
    const { work, category_id, subcategory_id, region, provincia, comuna, rating } = req.query;

    let searchTerms = [];
    if (work && work.trim() !== '') {
      searchTerms = work
        .toLowerCase()
        .split(/\s+/)
        .filter(word => word.length > 2 && !STOPWORDS.has(word));
    }

    const filterByCategory = category_id && category_id !== 'all' && category_id !== '0';
    const filterBySubcategory = subcategory_id && subcategory_id !== 'all' && subcategory_id !== '0';

    const andConditions = [];

    if (region && region !== 'Todas') andConditions.push({ region });
    if (provincia && provincia !== 'Todas') andConditions.push({ provincia });
    if (comuna && comuna !== 'Todas') andConditions.push({ comuna });

    const minRating = parseFloat(rating);
    if (!isNaN(minRating) && minRating > 0 && minRating <= 5) {
      const safeRating = Math.min(Math.max(minRating, 0), 5);
      andConditions.push(literal(`(
        SELECT AVG(pr.rating)
        FROM portfolio_reviews pr
        INNER JOIN portfolio_items pi ON pr.portfolioItemId = pi.id
        WHERE pi.expertoId = ExpertoProfile.userId
      ) >= ${safeRating}`));
    }

    if (filterBySubcategory) {
      andConditions.push({ '$Subcategories.id$': subcategory_id });
    } else if (filterByCategory) {
      andConditions.push({ '$Subcategories.category_id$': category_id });
    }

    if (searchTerms.length > 0) {
      const orConditions = [];
      searchTerms.forEach(term => {
        orConditions.push({ nombres: { [Op.like]: `%${term}%` } });
        orConditions.push({ apellidos: { [Op.like]: `%${term}%` } });
        orConditions.push({ bio: { [Op.like]: `%${term}%` } });
        orConditions.push({ '$Subcategories.name$': { [Op.like]: `%${term}%` } });
        orConditions.push({ '$Subcategories.keywords$': { [Op.like]: `%${term}%` } });
      });
      andConditions.push({ [Op.or]: orConditions });
    }

    const mainWhere = andConditions.length > 0 ? { [Op.and]: andConditions } : {};

    const experts = await ExpertoProfile.findAll({
      where: mainWhere,
      include: [
        {
          model: Subcategory,
          as: 'Subcategories',
          required: true,
          include: { model: Category, as: 'Category' },
        },
        { model: User, attributes: ['id', 'email'] },
      ],
      attributes: {
        include: [
          [
            literal(`(
              SELECT AVG(pr.rating)
              FROM portfolio_reviews pr
              INNER JOIN portfolio_items pi ON pr.portfolioItemId = pi.id
              WHERE pi.expertoId = ExpertoProfile.userId
            )`),
            'avg_portfolio_rating',
          ],
          [
            literal(`(
              SELECT COUNT(*)
              FROM portfolio_reviews pr
              INNER JOIN portfolio_items pi ON pr.portfolioItemId = pi.id
              WHERE pi.expertoId = ExpertoProfile.userId
            )`),
            'portfolio_review_count',
          ],
        ],
      },
      order: [[literal('avg_portfolio_rating'), 'DESC']],
      subQuery: false,
      distinct: true,
    });

    res.json(experts);
  } catch (err) {
    next(err);
  }
};

exports.getFeaturedExperts = async (req, res, next) => {
  try {
    const experts = await ExpertoProfile.findAll({
      include: [
        { model: User, attributes: ['id', 'email'] },
        {
          model: Subcategory,
          as: 'Subcategories',
          required: false,
          include: { model: Category, as: 'Category' },
        },
      ],
      attributes: {
        include: [
          [
            literal(`(
              SELECT AVG(pr.rating)
              FROM portfolio_reviews pr
              INNER JOIN portfolio_items pi ON pr.portfolioItemId = pi.id
              WHERE pi.expertoId = ExpertoProfile.userId
            )`),
            'avg_portfolio_rating',
          ],
          [
            literal(`(
              SELECT COUNT(*)
              FROM portfolio_reviews pr
              INNER JOIN portfolio_items pi ON pr.portfolioItemId = pi.id
              WHERE pi.expertoId = ExpertoProfile.userId
            )`),
            'portfolio_review_count',
          ],
        ],
      },
      order: [[literal('avg_portfolio_rating'), 'DESC']],
      limit: 3,
    });

    res.json(experts);
  } catch (err) {
    next(err);
  }
};

exports.getExpertById = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const expert = await ExpertoProfile.findOne({
      where: { userId },
      include: [
        { model: User, attributes: ['id', 'email'] },
        {
          model: Subcategory,
          as: 'Subcategories',
          required: false,
          include: { model: Category, as: 'Category' },
        },
      ],
      attributes: {
        include: [
          [
            literal(`(
              SELECT AVG(pr.rating)
              FROM portfolio_reviews pr
              INNER JOIN portfolio_items pi ON pr.portfolioItemId = pi.id
              WHERE pi.expertoId = ExpertoProfile.userId
            )`),
            'avg_portfolio_rating',
          ],
          [
            literal(`(
              SELECT COUNT(*)
              FROM portfolio_reviews pr
              INNER JOIN portfolio_items pi ON pr.portfolioItemId = pi.id
              WHERE pi.expertoId = ExpertoProfile.userId
            )`),
            'portfolio_review_count',
          ],
        ],
      },
    });

    if (!expert) return next(new AppError('Experto no encontrado', 404));

    res.json(expert);
  } catch (err) {
    next(err);
  }
};

exports.updateExpertProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { nombres, apellidos, telefono, bio, region, provincia, comuna } = req.body;

    const profile = await ExpertoProfile.findOne({ where: { userId } });
    if (!profile) return next(new AppError('Perfil de experto no encontrado', 404));

    const userUpdates = {};
    if (nombres !== undefined) userUpdates.nombres = nombres;
    if (apellidos !== undefined) userUpdates.apellidos = apellidos;

    const profileUpdates = {};
    if (telefono !== undefined) profileUpdates.telefono = telefono;
    if (bio !== undefined) profileUpdates.bio = bio;
    if (region !== undefined) profileUpdates.region = region;
    if (provincia !== undefined) profileUpdates.provincia = provincia;
    if (comuna !== undefined) profileUpdates.comuna = comuna;

    if (Object.keys(userUpdates).length > 0) {
      await User.update(userUpdates, { where: { id: userId } });
    }
    if (Object.keys(profileUpdates).length > 0) {
      await profile.update(profileUpdates);
    }

    const updated = await ExpertoProfile.findOne({
      where: { userId },
      include: [{ model: User, attributes: ['id', 'email', 'nombres', 'apellidos'] }],
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
};
