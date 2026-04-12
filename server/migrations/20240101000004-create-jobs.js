'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('jobs', {
      id: { type: Sequelize.CHAR(36), defaultValue: Sequelize.UUIDV4, primaryKey: true },
      titulo: { type: Sequelize.STRING, allowNull: false },
      descripcion: { type: Sequelize.TEXT, allowNull: false },
      presupuesto: { type: Sequelize.DECIMAL(10, 2) },
      region: { type: Sequelize.STRING },
      provincia: { type: Sequelize.STRING },
      comuna: { type: Sequelize.STRING },
      direccion: { type: Sequelize.STRING },
      estado: {
        type: Sequelize.ENUM('activo', 'en_proceso', 'completado', 'cancelado'),
        defaultValue: 'activo',
      },
      urgencia: { type: Sequelize.STRING },
      fecha_preferida: { type: Sequelize.DATE },
      fecha_expiracion: { type: Sequelize.DATE },
      categoryId: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: { model: 'categories', key: 'id' },
      },
      subcategoryId: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: { model: 'subcategories', key: 'id' },
      },
      clientId: {
        type: Sequelize.CHAR(36),
        references: { model: 'user', key: 'id' },
        onDelete: 'CASCADE',
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.addIndex('jobs', ['region']);
    await queryInterface.addIndex('jobs', ['comuna']);
    await queryInterface.addIndex('jobs', ['categoryId']);
    await queryInterface.addIndex('jobs', ['estado']);

    await queryInterface.createTable('job_photos', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      jobId: {
        type: Sequelize.CHAR(36),
        references: { model: 'jobs', key: 'id' },
        onDelete: 'CASCADE',
      },
      photo_url: { type: Sequelize.STRING, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable('job_applications', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      jobId: {
        type: Sequelize.CHAR(36),
        references: { model: 'jobs', key: 'id' },
        onDelete: 'CASCADE',
      },
      expertId: {
        type: Sequelize.CHAR(36),
        references: { model: 'user', key: 'id' },
        onDelete: 'CASCADE',
      },
      mensaje: { type: Sequelize.TEXT, allowNull: false },
      presupuesto_ofrecido: { type: Sequelize.DECIMAL(10, 2) },
      estado: {
        type: Sequelize.ENUM('pendiente', 'aceptado', 'rechazado'),
        defaultValue: 'pendiente',
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.addIndex('job_applications', ['jobId', 'expertId'], { unique: true });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('job_applications');
    await queryInterface.dropTable('job_photos');
    await queryInterface.dropTable('jobs');
  },
};
