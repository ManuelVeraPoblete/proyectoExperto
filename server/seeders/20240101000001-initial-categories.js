'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert('categories', [
      { name: 'Hogar', slug: 'hogar', description: 'Servicios generales para el hogar', is_active: true, created_at: now, updated_at: now },
    ]);

    const [categories] = await queryInterface.sequelize.query(
      "SELECT id FROM categories WHERE slug = 'hogar' LIMIT 1"
    );
    const categoryId = categories[0].id;

    await queryInterface.bulkInsert('subcategories', [
      { category_id: categoryId, name: 'Plomería', slug: 'plomeria', keywords: 'grifo, llave, lavamanos, baño, tubería, filtración, goteo, calefont', is_active: true, created_at: now, updated_at: now },
      { category_id: categoryId, name: 'Electricidad', slug: 'electricidad', keywords: 'enchufe, interruptor, tablero, corto, cables, luz, lámpara', is_active: true, created_at: now, updated_at: now },
      { category_id: categoryId, name: 'Carpintería', slug: 'carpinteria', keywords: 'mueble, repisa, puerta, madera, closet, cajón', is_active: true, created_at: now, updated_at: now },
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('subcategories', null, {});
    await queryInterface.bulkDelete('categories', null, {});
  },
};
