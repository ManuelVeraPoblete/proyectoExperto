const path = require('path');
const fs = require('fs');
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
    const { title, description, category, date } = req.body;

    // Construir array de rutas de las fotos subidas
    const imagePaths = (req.files || []).map(
      (f) => `/uploads/experto/${f.filename}`
    );
    const image_url = imagePaths.length > 0 ? JSON.stringify(imagePaths) : null;

    const item = await PortfolioItem.create({
      expertoId,
      title,
      description: description || null,
      category: category || null,
      image_url,
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

    // Eliminar archivos físicos del disco
    if (item.image_url) {
      try {
        const paths = JSON.parse(item.image_url);
        paths.forEach((relPath) => {
          const absPath = path.join(__dirname, '..', relPath);
          if (fs.existsSync(absPath)) fs.unlinkSync(absPath);
        });
      } catch (_) {
        // Si no es JSON válido, ignorar
      }
    }

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
