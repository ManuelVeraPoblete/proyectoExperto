'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cliente_profiles', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      userId: {
        type: Sequelize.CHAR(36),
        allowNull: false,
        references: { model: 'user', key: 'id' },
        onDelete: 'CASCADE',
      },
      nombres: { type: Sequelize.STRING },
      apellidos: { type: Sequelize.STRING },
      telefono: { type: Sequelize.STRING },
      direccion: { type: Sequelize.STRING },
      region: { type: Sequelize.STRING },
      provincia: { type: Sequelize.STRING },
      comuna: { type: Sequelize.STRING },
      avatar_url: { type: Sequelize.STRING },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable('experto_profiles', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      userId: {
        type: Sequelize.CHAR(36),
        allowNull: false,
        references: { model: 'user', key: 'id' },
        onDelete: 'CASCADE',
      },
      nombres: { type: Sequelize.STRING },
      apellidos: { type: Sequelize.STRING },
      telefono: { type: Sequelize.STRING },
      direccion: { type: Sequelize.STRING },
      region: { type: Sequelize.STRING },
      provincia: { type: Sequelize.STRING },
      comuna: { type: Sequelize.STRING },
      bio: { type: Sequelize.TEXT },
      avatar_url: { type: Sequelize.STRING },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable('experto_subcategories', {
      experto_id: {
        type: Sequelize.INTEGER,
        references: { model: 'experto_profiles', key: 'id' },
        onDelete: 'CASCADE',
      },
      subcategory_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: { model: 'subcategories', key: 'id' },
        onDelete: 'CASCADE',
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('experto_subcategories');
    await queryInterface.dropTable('experto_profiles');
    await queryInterface.dropTable('cliente_profiles');
  },
};
