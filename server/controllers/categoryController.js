const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Lista todas las categorías con sus subcategorías
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Lista de categorías
 */
exports.getCategories = async (req, res, next) => {
  try {
    const list = await Category.findAll({
      include: { model: Subcategory, as: 'Subcategories' },
    });
    res.json(list);
  } catch (err) {
    next(err);
  }
};
