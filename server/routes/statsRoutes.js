const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const sequelize = require('../config/database');
const User = require('../models/User');
const Job = require('../models/Job');

router.get('/', async (req, res) => {
  try {
    const [expertCount, completedJobs, ratingResult] = await Promise.all([
      User.count({ where: { user_type: 'experto' } }),
      Job.count({ where: { estado: 'completado' } }),
      Job.findOne({
        attributes: [[sequelize.fn('AVG', sequelize.col('calificacion')), 'avgRating']],
        where: { calificacion: { [Op.not]: null } },
        raw: true
      })
    ]);

    const avgRating = ratingResult?.avgRating
      ? parseFloat(ratingResult.avgRating).toFixed(1)
      : null;

    res.json({
      expertCount,
      completedJobs,
      avgRating,
      responseTime: '12h'
    });
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo estadísticas' });
  }
});

module.exports = router;
