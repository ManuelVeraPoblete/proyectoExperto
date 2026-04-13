const PortfolioItem = require('../models/PortfolioItem');
const PortfolioReaction = require('../models/PortfolioReaction');
const PortfolioReview = require('../models/PortfolioReview');
const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');

exports.getPortfolio = async (req, res, next) => {
  try {
    const { expertUserId } = req.params;

    const items = await PortfolioItem.findAll({
      where: { expertoId: expertUserId },
      include: [
        {
          model: PortfolioReaction,
          as: 'Reactions',
          include: [{ model: User, as: 'Reactor', attributes: ['id', 'nombres', 'apellidos'] }],
        },
        {
          model: PortfolioReview,
          as: 'Reviews',
          include: [{ model: User, as: 'Reviewer', attributes: ['id', 'nombres', 'apellidos'] }],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(items);
  } catch (err) {
    next(err);
  }
};

exports.createItem = async (req, res, next) => {
  try {
    const expertoId = req.user.id;
    const { title, description, category, image_url, date } = req.body;

    const item = await PortfolioItem.create({
      expertoId,
      title,
      description: description || null,
      category: category || null,
      image_url: image_url || null,
      date: date || null,
    });

    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

exports.deleteItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const userId = req.user.id;

    const item = await PortfolioItem.findByPk(itemId);
    if (!item) return next(new AppError('Item no encontrado', 404));
    if (item.expertoId !== userId) return next(new AppError('No tienes permiso para eliminar este item', 403));

    await item.destroy();
    res.json({ message: 'Item eliminado' });
  } catch (err) {
    next(err);
  }
};

exports.reactToItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const userId = req.user.id;
    const { reaction } = req.body;

    const item = await PortfolioItem.findByPk(itemId);
    if (!item) return next(new AppError('Item no encontrado', 404));

    const existing = await PortfolioReaction.findOne({ where: { portfolioItemId: itemId, userId } });

    if (existing) {
      if (existing.reaction === reaction) {
        await existing.destroy();
        return res.json({ action: 'removed', reaction });
      } else {
        await existing.update({ reaction });
        return res.json({ action: 'changed', reaction });
      }
    }

    await PortfolioReaction.create({ portfolioItemId: itemId, userId, reaction });
    res.json({ action: 'added', reaction });
  } catch (err) {
    next(err);
  }
};

exports.addReview = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const userId = req.user.id;
    const { comment, rating } = req.body;

    const item = await PortfolioItem.findByPk(itemId);
    if (!item) return next(new AppError('Item no encontrado', 404));

    const existing = await PortfolioReview.findOne({ where: { portfolioItemId: itemId, userId } });
    if (existing) return next(new AppError('Ya dejaste una reseña en este item', 409));

    const review = await PortfolioReview.create({
      portfolioItemId: itemId,
      userId,
      comment,
      rating,
    });

    const withUser = await PortfolioReview.findByPk(review.id, {
      include: [{ model: User, as: 'Reviewer', attributes: ['id', 'nombres', 'apellidos'] }],
    });

    res.status(201).json(withUser);
  } catch (err) {
    next(err);
  }
};
