require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/database');
const logger = require('./config/logger');
const Category = require('./models/Category');
const Subcategory = require('./models/Subcategory');

const PORT = process.env.PORT || 3001;

// En producción se usa `npx sequelize-cli db:migrate` antes de arrancar.
// En desarrollo se mantiene sync solo para facilitar el setup inicial.
const syncOptions = process.env.NODE_ENV === 'production'
  ? {} // sin alter en producción
  : { alter: { drop: false } }; // agrega columnas nuevas pero no toca FKs/índices existentes

sequelize.sync(syncOptions)
  .then(async () => {
    logger.info('Base de datos sincronizada');

    // Seed inicial: solo si no hay categorías
    const count = await Category.count();
    if (count === 0) {
      const cat = await Category.create({
        name: 'Hogar',
        slug: 'hogar',
        description: 'Servicios generales para el hogar',
      });
      await Subcategory.bulkCreate([
        { category_id: cat.id, name: 'Plomería', slug: 'plomeria', keywords: 'grifo, llave, lavamanos, baño, tubería, filtración, goteo, calefont' },
        { category_id: cat.id, name: 'Electricidad', slug: 'electricidad', keywords: 'enchufe, interruptor, tablero, corto, cables, luz, lámpara' },
        { category_id: cat.id, name: 'Carpintería', slug: 'carpinteria', keywords: 'mueble, repisa, puerta, madera, closet, cajón' },
      ]);
      logger.info('Datos iniciales de categorías creados');
    }

    app.listen(PORT, () => {
      logger.info(`API corriendo en http://localhost:${PORT}`);
      logger.info(`Docs disponibles en http://localhost:${PORT}/api/docs`);
    });
  })
  .catch(err => logger.error('Error sincronización BD:', err));
