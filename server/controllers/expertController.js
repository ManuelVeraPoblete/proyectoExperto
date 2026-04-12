const { Op } = require('sequelize');
const ExpertoProfile = require('../models/ExpertoProfile');
const Subcategory = require('../models/Subcategory');
const Category = require('../models/Category');
const User = require('../models/User');

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
    const { work, category_id, subcategory_id, region, provincia, comuna } = req.query;

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
      subQuery: false,
      distinct: true,
    });

    res.json(experts);
  } catch (err) {
    next(err);
  }
};
