'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('jobs', 'expertId', {
      type: Sequelize.CHAR(36),
      allowNull: true,
      references: { model: 'user', key: 'id' },
      onDelete: 'SET NULL',
      after: 'clientId',
    });
    await queryInterface.addColumn('jobs', 'calificacion', {
      type: Sequelize.DECIMAL(2, 1),
      allowNull: true,
      after: 'expertId',
    });
    await queryInterface.addColumn('jobs', 'resena', {
      type: Sequelize.TEXT,
      allowNull: true,
      after: 'calificacion',
    });
    await queryInterface.addIndex('jobs', ['expertId'], { name: 'jobs_expert_id' });
    await queryInterface.addIndex('jobs', ['clientId'], { name: 'jobs_client_id' });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('jobs', 'jobs_expert_id');
    await queryInterface.removeIndex('jobs', 'jobs_client_id');
    await queryInterface.removeColumn('jobs', 'resena');
    await queryInterface.removeColumn('jobs', 'calificacion');
    await queryInterface.removeColumn('jobs', 'expertId');
  },
};
