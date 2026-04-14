/**
 * Script de migración: crea PortfolioItem + PortfolioReview para todos los trabajos
 * completados que aún no tienen una entrada manual en portfolio_items.
 *
 * Uso: node scripts/migrate_completed_jobs_to_portfolio.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

// Cargar app solo para inicializar asociaciones entre modelos; no arrancar el servidor
process.env.MIGRATION_MODE = 'true';
const sequelize  = require('../config/database');

// Registrar asociaciones definidas en app.js sin levantar Express
require('../models/Job');
require('../models/JobPhoto');
require('../models/PortfolioItem');
require('../models/PortfolioReview');
require('../models/PortfolioReaction');
require('../models/User');
require('../models/ClienteProfile');
require('../models/ExpertoProfile');
require('../models/Category');
require('../models/Subcategory');
require('../models/JobApplication');
require('../models/Message');
require('../models/Report');

// Ejecutar bloque de asociaciones de app.js
const { execSync } = require('child_process');
const path = require('path');

// En vez de requerir app.js entero, definimos las asociaciones mínimas aquí
const Job         = require('../models/Job');
const JobPhoto    = require('../models/JobPhoto');
const PortfolioItem   = require('../models/PortfolioItem');
const PortfolioReview = require('../models/PortfolioReview');

Job.hasMany(JobPhoto, { foreignKey: 'jobId', as: 'Fotos' });
JobPhoto.belongsTo(Job, { foreignKey: 'jobId' });

async function main() {
  await sequelize.authenticate();
  console.log('Conectado a la base de datos.\n');

  // Todos los trabajos completados que tienen experto asignado
  const jobs = await Job.findAll({
    where: { estado: 'completado' },
    include: [{ model: JobPhoto, as: 'Fotos' }],
  });

  console.log(`Trabajos completados encontrados: ${jobs.length}\n`);

  let creados   = 0;
  let omitidos  = 0;

  for (const job of jobs) {
    if (!job.expertId) {
      console.log(`  ⚠  Job ${job.id} sin expertId — omitido`);
      omitidos++;
      continue;
    }

    // ¿Ya existe un PortfolioItem con el mismo título para este experto?
    const existing = await PortfolioItem.findOne({
      where: { expertoId: job.expertId, title: job.titulo },
    });

    if (existing) {
      console.log(`  ↩  Job "${job.titulo}" ya tiene PortfolioItem (id=${existing.id}) — omitido`);
      omitidos++;
      continue;
    }

    // Construir image_url desde JobPhoto (fotos del cierre)
    const imagePaths = (job.Fotos ?? []).map(f => f.photo_url);
    const image_url  = imagePaths.length > 0 ? JSON.stringify(imagePaths) : null;

    // Crear PortfolioItem
    const item = await PortfolioItem.create({
      expertoId:   job.expertId,
      title:       job.titulo,
      description: job.descripcion || null,
      category:    null,
      image_url,
      date: (job.updatedAt ?? job.createdAt).toISOString().split('T')[0],
    });

    // Crear PortfolioReview si el cliente dejó calificación
    if (job.calificacion && job.clientId) {
      const comment = job.resena
        || `Trabajo calificado con ${job.calificacion} estrella${job.calificacion !== 1 ? 's' : ''}.`;

      await PortfolioReview.create({
        portfolioItemId: item.id,
        userId:  job.clientId,
        comment,
        rating:  job.calificacion,
      });

      console.log(`  ✓  Job "${job.titulo}" → PortfolioItem id=${item.id}, reseña ${job.calificacion}★`);
    } else {
      console.log(`  ✓  Job "${job.titulo}" → PortfolioItem id=${item.id} (sin calificación)`);
    }

    creados++;
  }

  console.log(`\nResumen: ${creados} creados, ${omitidos} omitidos.`);
  await sequelize.close();
}

main().catch(err => {
  console.error('Error en migración:', err);
  process.exit(1);
});
