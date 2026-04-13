'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // ── portfolio_items ──────────────────────────────────────────────────────
    await queryInterface.createTable('portfolio_items', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      expertoId: {
        type: Sequelize.CHAR(36),
        allowNull: false,
        references: { model: 'user', key: 'id' },
        onDelete: 'CASCADE',
      },
      title: { type: Sequelize.STRING(200), allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true },
      category: { type: Sequelize.STRING(100), allowNull: true },
      image_url: { type: Sequelize.STRING(500), allowNull: true },
      date: { type: Sequelize.DATEONLY, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addIndex('portfolio_items', ['expertoId']);

    // ── portfolio_reactions ──────────────────────────────────────────────────
    await queryInterface.createTable('portfolio_reactions', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      portfolioItemId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'portfolio_items', key: 'id' },
        onDelete: 'CASCADE',
      },
      userId: {
        type: Sequelize.CHAR(36),
        allowNull: false,
        references: { model: 'user', key: 'id' },
        onDelete: 'CASCADE',
      },
      reaction: {
        type: Sequelize.ENUM('heart', 'like', 'clap', 'dislike'),
        allowNull: false,
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addIndex('portfolio_reactions', ['portfolioItemId', 'userId'], {
      unique: true,
      name: 'portfolio_reactions_unique',
    });

    // ── portfolio_reviews ────────────────────────────────────────────────────
    await queryInterface.createTable('portfolio_reviews', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      portfolioItemId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'portfolio_items', key: 'id' },
        onDelete: 'CASCADE',
      },
      userId: {
        type: Sequelize.CHAR(36),
        allowNull: false,
        references: { model: 'user', key: 'id' },
        onDelete: 'CASCADE',
      },
      comment: { type: Sequelize.TEXT, allowNull: false },
      rating: { type: Sequelize.DECIMAL(2, 1), allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addIndex('portfolio_reviews', ['portfolioItemId', 'userId'], {
      unique: true,
      name: 'portfolio_reviews_unique',
    });

    // ── messages ─────────────────────────────────────────────────────────────
    await queryInterface.createTable('messages', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      senderId: {
        type: Sequelize.CHAR(36),
        allowNull: false,
        references: { model: 'user', key: 'id' },
        onDelete: 'CASCADE',
      },
      receiverId: {
        type: Sequelize.CHAR(36),
        allowNull: false,
        references: { model: 'user', key: 'id' },
        onDelete: 'CASCADE',
      },
      content: { type: Sequelize.TEXT, allowNull: false },
      is_read: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addIndex('messages', ['senderId', 'receiverId']);
    await queryInterface.addIndex('messages', ['receiverId', 'is_read']);

    // ── reports ──────────────────────────────────────────────────────────────
    await queryInterface.createTable('reports', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      type: {
        type: Sequelize.ENUM('review', 'user', 'post', 'language'),
        allowNull: false,
      },
      reason: { type: Sequelize.STRING(200), allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true },
      reporterId: {
        type: Sequelize.CHAR(36),
        allowNull: true,
        references: { model: 'user', key: 'id' },
        onDelete: 'SET NULL',
      },
      reportedUserId: {
        type: Sequelize.CHAR(36),
        allowNull: true,
        references: { model: 'user', key: 'id' },
        onDelete: 'SET NULL',
      },
      reportedContent: { type: Sequelize.TEXT, allowNull: true },
      status: {
        type: Sequelize.ENUM('pending', 'reviewed', 'resolved'),
        allowNull: false,
        defaultValue: 'pending',
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addIndex('reports', ['status']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('reports');
    await queryInterface.dropTable('messages');
    await queryInterface.dropTable('portfolio_reviews');
    await queryInterface.dropTable('portfolio_reactions');
    await queryInterface.dropTable('portfolio_items');
  },
};
